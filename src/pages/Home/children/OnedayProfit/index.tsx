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
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {SCREEN_WIDTH, themeColor} from '@/utils/index';
import GlobalStyles from '@/assets/style/global';
import BgIcon from '@/assets/image/home/everydayProfit/bg.png';
import {xstrategyCycleHisPage} from '@/api/trade';
import Empty from '@/components/Empty';
import Item from '../Billing/components/Item';
import {RouteProp} from '@react-navigation/core';
import IconFont from '@/assets/iconfont';
import Loading from '@/components/Loading';
import Touchable from '@/components/Touchable';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'OnedayProfit'>;
}

const OnedayProfit: React.FC<IProps> = ({navigation, route}) => {
  const {currency, date, dayIncome} = route.params;

  const [list, setList] = useState<IXStrategyHistory[]>([]);
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
        const data: any = await xstrategyCycleHisPage({
          pageNum: page,
          currentDate: date,
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
    [date, list, pageNum],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPageList(true);
    } catch (error) {}
    setRefreshing(false);
  }, [getPageList]);
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<IXStrategyHistory>) => {
      return <Item data={item} />;
    },
    [],
  );
  const keyExtractor = useCallback((item: IXStrategyHistory) => item.id, []);
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
      return null;
    }
    if (loading && list.length) {
      return <Loading />;
    }
  }, [hasMore, list.length, loading]);

  useEffect(() => {
    const refreshData = async () => {
      try {
        setRefreshing(true);
        const data: any = await xstrategyCycleHisPage({
          pageNum: 1,
          currentDate: date,
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
  }, [date]);

  const goTradeRecord = useCallback(() => {
    navigation.navigate('TradeRecord', {
      date,
    });
  }, [date, navigation]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable onPress={goTradeRecord} style={GlobalStyles.ph15}>
          <Text style={styles.head_right}>交易记录</Text>
        </Touchable>
      ),
    });
  }, [goTradeRecord, navigation]);

  return (
    <View style={GlobalStyles.flex_1}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground style={styles.bg} source={BgIcon}>
        <View style={GlobalStyles.flex_row}>
          <IconFont name="icon-date" size={13} />
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.head_title}>当日盈利({currency})</Text>
        <Text style={styles.head_txt}>{dayIncome}</Text>
      </ImageBackground>
      <View
        style={[
          styles.sub_title_box,
          GlobalStyles.ph15,
          GlobalStyles.flex_row,
        ]}>
        <View style={styles.line} />
        <Text style={styles.sub_title}>盈利循环列表</Text>
      </View>
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
  head_right: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
  },
  bg: {
    width: SCREEN_WIDTH,
    height: 131,
    paddingHorizontal: 15,
    paddingTop: 17,
  },
  date: {
    marginLeft: 5,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#fff',
  },
  head_title: {
    marginTop: 21,
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
  sub_title_box: {
    paddingTop: 15,
    paddingBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  line: {
    backgroundColor: themeColor,
    width: 3,
    height: 17,
    borderRadius: 2,
  },
  sub_title: {
    marginLeft: 9,
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 15,
    paddingTop: 7,
  },
});

export default OnedayProfit;
