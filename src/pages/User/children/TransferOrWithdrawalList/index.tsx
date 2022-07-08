import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  FlatList,
  RefreshControl,
  ListRenderItemInfo,
  InteractionManager,
} from 'react-native';
import {RouteProp} from '@react-navigation/core';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import Empty from '@/components/Empty';
import EmptyIcon from '@/assets/image/user/account/empty.png';
import {getDictList} from '@/api/public';
import {transferOrderMyPage, turnOutMyPage} from '@/api/trade';
import Loading from '@/components/Loading';
import Item from './Components/Item';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'TransferOrWithdrawalList'>;
}

const themeColor = '#D59420';

const TransferOrWithdrawalList: React.FC<IProps> = ({navigation, route}) => {
  const {type} = route.params;

  const [statusObj, setStatusObj] = useState<Record<string, string>>({});
  useEffect(() => {
    navigation.setOptions({
      headerTitle: type === '1' ? '提币记录' : '转账记录',
    });
    const field = type === '1' ? 'turnOut.status' : 'transferOrder.status';
    getDictList(field).then((d: any) => {
      if (Array.isArray(d)) {
        const obj: any = {};
        d.forEach((it: any) => {
          obj[it.key] = it.value;
        });
        setStatusObj(obj);
      }
    });
  }, [navigation, type]);

  const [list, setList] = useState<ITransfer[]>([]);
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
        let data: any;
        if (type === '1') {
          data = await turnOutMyPage({
            pageNum: page,
          });
        } else {
          data = await transferOrderMyPage({
            pageNum: page,
          });
        }

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
    [list, pageNum, type],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPageList(true);
    } catch (error) {}
    setRefreshing(false);
  }, [getPageList]);
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ITransfer>) => {
      return <Item data={item} statusObj={statusObj} type={type} />;
    },
    [statusObj, type],
  );
  const keyExtractor = useCallback((item: ITransfer) => item.id, []);
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
          message={`暂无${type === '1' ? '提币' : '转账'}记录～`}
        />
      ),
    [loading, hasMore, type],
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
    const task = InteractionManager.runAfterInteractions(async () => {
      setRefreshing(true);
      let data: any;
      try {
        if (type === '1') {
          data = await turnOutMyPage({
            pageNum: 1,
          });
        } else {
          data = await transferOrderMyPage({
            pageNum: 1,
          });
        }
        setList(data.list);
        setPageNum(data.pageNum);
        setHasMore(data.list.length < data.total);
      } catch (error) {}
      setRefreshing(false);
      setLoading(false);
    });
    return () => task.cancel();
  }, [type]);

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
    paddingTop: 15,
    backgroundColor: '#F7F7F7',
  },
  empty: {
    paddingTop: 150,
  },
});

export default TransferOrWithdrawalList;
