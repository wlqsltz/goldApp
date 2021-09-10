import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  InteractionManager,
  StatusBar,
  RefreshControl,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import Empty from '@/components/Empty';
import {jourMyPage} from '@/api/user';
import Loading from '@/components/Loading';
import Item from './components/Item';
import EmptyIcon from '@/assets/image/user/account/empty.png';

interface IProps {}

const themeColor = '#D59420';

const ChargeList: React.FC<IProps> = () => {
  const [list, setList] = useState<IBill[]>([]);
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
        const data: any = await jourMyPage({
          pageNum: page,
          bizCategory: 'charge',
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
  const renderItem = useCallback(({item}: ListRenderItemInfo<IBill>) => {
    return <Item data={item} />;
  }, []);
  const keyExtractor = useCallback((item: IBill) => item.id, []);
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
          message="暂无充币记录～"
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

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setRefreshing(true);
      jourMyPage({
        pageNum: 1,
        bizCategory: 'charge',
      })
        .then((data: any) => {
          setList(data.list);
          setPageNum(data.pageNum);
          setHasMore(data.list.length < data.total);
        })
        .finally(() => {
          setRefreshing(false);
          setLoading(false);
        });
    });
    return () => task.cancel();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <FlatList
        style={styles.list}
        data={list}
        renderItem={renderItem}
        refreshing={refreshing}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        ListFooterComponent={footer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColor]}
            tintColor={themeColor}
          />
        }
        ListEmptyComponent={empty}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#F7F7F7',
  },
  empty: {
    paddingTop: 150,
  },
});

export default ChargeList;
