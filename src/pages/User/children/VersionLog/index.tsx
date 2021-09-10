import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  RefreshControl,
  ListRenderItemInfo,
  InteractionManager,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackNavigation} from '@/navigator/index';
import {getVersionLogPage} from '@/api/public';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';
import {dateFormat} from '@/utils/index';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

const VersionLog: React.FC<IProps> = ({navigation}) => {
  const [list, setList] = useState<IMessage[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  const getPageList = useCallback(
    async (refresh?: boolean) => {
      setLoading(true);
      try {
        let page = 1;
        if (!refresh) {
          page = pageNum + 1;
        }
        const data: any = await getVersionLogPage({
          sort: '-orderNo,-id',
          status: '1',
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

  const renderItem = useCallback(({item}: ListRenderItemInfo<IMessage>) => {
    return (
      <View style={styles.item} key={item.id}>
        <View style={styles.item_title}>
          <Text style={styles.item_text_version}>{item.title}</Text>
          <Text style={styles.item_text_time}>
            更新时间：{dateFormat(item.updateDatetime)}
          </Text>
        </View>
        <Text style={styles.item_text_content}>{item.content}</Text>
      </View>
    );
  }, []);
  const keyExtractor = useCallback((item: IMessage) => item.id, []);
  const onEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    getPageList();
  }, [getPageList, hasMore, loading]);
  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty containerStyle={styles.empty} message={'暂无版本日志～'} />
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

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        try {
          setRefreshing(true);
          const data: any = await getVersionLogPage({
            sort: '-orderNo,-id',
            status: '1',
            pageNum: 1,
          });
          setList(data.list);
          setPageNum(data.pageNum);
          setHasMore(data.list.length < data.total);
        } catch (error) {}
        setRefreshing(false);
      });

      return () => task.cancel();
    }, []),
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <FlatList
        style={styles.list}
        ListFooterComponent={footer}
        ListEmptyComponent={empty}
        ItemSeparatorComponent={renderSeparator}
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        refreshing={refreshing}
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
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingLeft: 25,
    backgroundColor: '#fff',
  },
  item: {
    paddingRight: 30,
    paddingBottom: 16,
  },
  item_title: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text_version: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 23,
    color: '#333',
  },
  item_text_time: {
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 17,
    color: '#999',
  },
  item_text_content: {
    marginLeft: 5,
    marginTop: 5,
    fontSize: 14,
    lineHeight: 25,
    color: '#666',
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D1D1',
  },
  empty: {
    paddingTop: 150,
  },
});

export default VersionLog;
