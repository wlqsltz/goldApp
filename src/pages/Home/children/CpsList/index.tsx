import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  TextInput,
  View,
  Text,
  Animated,
  InteractionManager,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';
import Empty from '@/components/Empty';
import EmptyIcon from '@/assets/image/message/empty.png';
import Loading from '@/components/Loading';
import IconFont from '@/assets/iconfont';
import Touchable from '@/components/Touchable';
import Item from './components/Item';
import {operatorPageFront} from '@/api/home';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

const Home: React.FC<IProps> = ({navigation}) => {
  const padTopStyle = useMemo(
    () => ({paddingTop: getStatusBarHeight() + 23}),
    [],
  );
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const [keywords, setKeywords] = useState('');

  const [gdActive, setGdActive] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const toggleCheck = useCallback(() => {
    if (!gdActive) {
      Animated.timing(translateX, {
        toValue: 17,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    setGdActive(prev => !prev);
  }, [gdActive, translateX]);

  const [list, setList] = useState<IOperator[]>([]);
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
        const params: IPageParams = {
          pageNum: page,
          nickname: keywords,
        };
        gdActive && (params.isJoinFlag = 1);
        const data: any = await operatorPageFront(params);

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
    [gdActive, keywords, list, pageNum],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPageList(true);
    } catch (error) {}
    setRefreshing(false);
  }, [getPageList]);
  const renderItem = useCallback(({item}: ListRenderItemInfo<IOperator>) => {
    return <Item data={item} />;
  }, []);
  const keyExtractor = useCallback((item: IOperator) => item.id, []);
  const onEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    getPageList();
  }, [getPageList, hasMore, loading]);

  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty
          source={EmptyIcon}
          containerStyle={styles.empty}
          message="暂无操盘手～"
        />
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
  const renderSeparator = useCallback(() => <View style={styles.line} />, []);

  const search = useCallback(async (value: string) => {
    setKeywords(value);
  }, []);
  const header = useMemo(
    () => (
      <View style={[styles.header, padTopStyle]}>
        <Touchable onPress={goBack} style={styles.back}>
          <IconFont name="icon-fanhui" size={28} color="#333" />
        </Touchable>
        <View style={styles.tds_search}>
          <IconFont name="icon-sousuo" size={13} color="#B4B4BC" />
          <TextInput
            style={styles.tr_iup}
            placeholderTextColor="#A4A4AC"
            placeholder="搜索你感兴趣的操盘手"
            autoCapitalize="none"
            clearButtonMode="while-editing"
            onChangeText={search}
          />
        </View>
      </View>
    ),
    [goBack, padTopStyle, search],
  );

  useEffect(() => {
    const refreshData = async () => {
      try {
        setRefreshing(true);
        const params: IPageParams = {
          pageNum: 1,
          nickname: keywords,
        };
        gdActive && (params.isJoinFlag = 1);
        const data: any = await operatorPageFront(params);
        setList(data.list);
        setPageNum(data.pageNum);
        setHasMore(data.list.length < data.total);
      } catch (error) {}
      setRefreshing(false);
      setLoading(false);
    };
    const task = InteractionManager.runAfterInteractions(refreshData);
    return () => task.cancel();
  }, [keywords, gdActive]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {header}
      <View style={styles.sub_head_box}>
        <Text style={styles.sub_head_title}>操盘手</Text>
        <Touchable
          ms={100}
          onPress={toggleCheck}
          style={styles.sub_head_tip_box}>
          <Text style={styles.sub_head_tip}>只显示跟单中</Text>
          <Animated.View
            style={[
              styles.check_box,
              gdActive ? styles.check_box_active : null,
            ]}>
            <Animated.View
              style={[
                styles.check_button,
                {
                  transform: [
                    {
                      translateX,
                    },
                  ],
                },
              ]}
            />
          </Animated.View>
        </Touchable>
      </View>
      <FlatList
        style={styles.list}
        ListFooterComponent={footer}
        ListEmptyComponent={empty}
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        ItemSeparatorComponent={renderSeparator}
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
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  back: {
    paddingLeft: 8,
    paddingRight: 5.5,
  },
  tds_search: {
    height: 33,
    paddingLeft: 20,
    paddingRight: 18,
    backgroundColor: '#F2F2F5',
    flex: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  tr_iup: {
    flex: 1,
    paddingLeft: 5,
    fontSize: 12,
    lineHeight: 17,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  sub_head_box: {
    paddingHorizontal: 15,
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sub_head_title: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 21,
    fontWeight: 'bold',
  },
  sub_head_tip_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sub_head_tip: {
    fontSize: 12,
    color: '#A4A4AC',
    lineHeight: 17,
  },
  check_box: {
    width: 34,
    height: 17,
    backgroundColor: '#D8D8D8',
    borderRadius: 8,
    paddingHorizontal: 1,
    paddingVertical: 1,
    marginLeft: 5,
  },
  check_box_active: {
    backgroundColor: '#D59420',
  },
  check_button: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 7.5,
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  line: {
    backgroundColor: 'rgba(238, 239, 245, 0.8)',
    height: 1,
  },
  empty: {
    paddingTop: 150,
  },
});

export default Home;
