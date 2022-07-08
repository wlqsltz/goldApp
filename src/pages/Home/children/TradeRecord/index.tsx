import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  InteractionManager,
  ListRenderItemInfo,
  RefreshControl,
  FlatList,
} from 'react-native';
import {RouteProp} from '@react-navigation/core';
import {RootStackParamList} from '@/navigator/index';
import GlobalStyles from '@/assets/style/global';
import {enstrustCommandFront} from '@/api/trade';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import Item from './components/Item';
import {themeColor} from '@/utils/index';

interface IProps {
  route: RouteProp<RootStackParamList, 'TradeRecord'>;
}

const TradeRecord: React.FC<IProps> = ({route}) => {
  const {symbol = '', toSymbol = '', date} = route.params;

  const [list, setList] = useState<ITradeRecord[]>([]);
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
        const data: any = await enstrustCommandFront({
          pageNum: page,
          symbol,
          toSymbol,
          dataTime: date,
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
    [date, list, pageNum, symbol, toSymbol],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPageList(true);
    } catch (error) {}
    setRefreshing(false);
  }, [getPageList]);
  const renderItem = useCallback(({item}: ListRenderItemInfo<ITradeRecord>) => {
    return <Item data={item} />;
  }, []);
  const keyExtractor = useCallback((item: ITradeRecord) => item.id, []);
  const onEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    getPageList();
  }, [getPageList, hasMore, loading]);

  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty containerStyle={GlobalStyles.empty} message="暂无交易记录～" />
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
        const data: any = await enstrustCommandFront({
          pageNum: 1,
          symbol,
          toSymbol,
          dataTime: date,
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
  }, [date, symbol, toSymbol]);

  return (
    <View style={GlobalStyles.flex_1}>
      <StatusBar barStyle="dark-content" />
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
  list: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});

export default TradeRecord;
