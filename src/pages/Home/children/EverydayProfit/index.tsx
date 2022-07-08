import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  StyleSheet,
  ListRenderItemInfo,
  RefreshControl,
  FlatList,
  InteractionManager,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {SCREEN_WIDTH, themeColor} from '@/utils/index';
import GlobalStyles from '@/assets/style/global';
import BgIcon from '@/assets/image/home/everydayProfit/bg.png';
import {xstrategyCycleIncomePage} from '@/api/trade';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';
import Item from './components/Item';

export interface IEntity {
  currency: string;
  date: string;
  dayIncome: string;
}

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'EverydayProfit'>;
}

const EverydayProfit: React.FC<IProps> = ({navigation, route}) => {
  const {currency, totalIncome} = route.params;

  const [list, setList] = useState<IEntity[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  const getPageList = useCallback(
    async (refresh?: boolean) => {
      setLoading(true);
      try {
        let page = 1;
        if (!refresh) {
          page = pageNum + 1;
        }
        const data: any = await xstrategyCycleIncomePage({
          pageNum: page,
        });

        let newList = data.list;
        if (!refresh) {
          newList = list.concat(newList);
        }
        setList(newList);
        setPageNum(data.pageNum);
        setHasMore(newList.length < data.total);
      } catch (error) {}
      setLoading(false);
    },
    [list, pageNum],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPageList(true);
    } catch (error) {}
    setRefreshing(false);
  }, [getPageList]);
  const renderItem = useCallback(({item}: ListRenderItemInfo<IEntity>) => {
    return <Item data={item} />;
  }, []);
  const keyExtractor = useCallback(
    (item: IEntity, index: number) => index.toString(),
    [],
  );
  const onEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    getPageList();
  }, [getPageList, hasMore, loading]);

  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty containerStyle={GlobalStyles.empty} message="暂无盈利～" />
      ),
    [loading, hasMore],
  );
  const footer = useMemo(() => {
    if (!hasMore) {
      return <View style={GlobalStyles.list_footer} />;
    }
    if (loading && list.length) {
      return <Loading />;
    }
  }, [hasMore, list.length, loading]);

  useEffect(() => {
    const refreshData = async () => {
      try {
        setRefreshing(true);
        const data: any = await xstrategyCycleIncomePage({
          pageNum: 1,
        });
        setList(data.list);
        setPageNum(data.pageNum);
        setHasMore(data.list.length < data.total);
      } catch (error) {}
      setRefreshing(false);
      setLoading(false);
    };
    const task = InteractionManager.runAfterInteractions(refreshData);
    return () => task.cancel();
  }, []);

  return (
    <View style={GlobalStyles.flex_1}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground style={styles.bg} source={BgIcon}>
        <Text style={styles.head_title}>累计盈利({currency})</Text>
        <Text style={styles.head_txt}>{totalIncome}</Text>
      </ImageBackground>
      <FlatList
        style={styles.list}
        ListFooterComponent={footer}
        ListEmptyComponent={empty}
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColor]}
            tintColor={themeColor}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: SCREEN_WIDTH,
    height: 111,
    paddingHorizontal: 15,
  },
  head_item: {
    alignItems: 'flex-end',
  },
  head_title: {
    marginTop: 28,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#fff',
    lineHeight: 19,
  },
  head_txt: {
    marginTop: 8,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
  },
  list: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});

export default EverydayProfit;
