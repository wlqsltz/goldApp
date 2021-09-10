import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import Item from './components/Item';
import TabBarItem from './components/TabBarItem';
import Touchable from '@/components/Touchable';
import {createSelector} from 'reselect';
import {RootState} from '@/models/index';
import {useDispatch, useSelector} from 'react-redux';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';
import Carousel from './components/Carousel';
import ReadAllMsgModal from './components/ReadAllMsgModal';
import IconFont from '@/assets/iconfont';
import EmptyIcon from '@/assets/image/message/empty.png';
import {RouteProp, useFocusEffect} from '@react-navigation/native';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'BottomTabs'>;
}

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['message/getExchangeApiKey'],
);
const selectUnReadInfo = createSelector(
  (state: RootState) => state.message,
  message => message.unReadInfo,
);
const selectActiveIndex = createSelector(
  (state: RootState) => state.message,
  message => message.activeIndex,
);
const selectMessageList = createSelector(
  (state: RootState) => state.message,
  message => message.messageList,
);
const selectNoticeList = createSelector(
  (state: RootState) => state.message,
  message => message.noticeList,
);
const selectHasMore = createSelector(
  (state: RootState) => state.message,
  message => message.pagination.hasMore,
);

const Message: React.FC<IProps> = ({navigation, route}) => {
  const loading = useSelector(selectLoading);
  const unReadInfo = useSelector(selectUnReadInfo);
  const activeIndex = useSelector(selectActiveIndex);
  const messageList = useSelector(selectMessageList);
  const noticeList = useSelector(selectNoticeList);
  const hasMore = useSelector(selectHasMore);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch({
      type: 'message/getMessages',
      callback: () => setRefreshing(false),
    });
    dispatch({
      type: 'message/getUnReadCount',
    });
  }, [dispatch]);
  const renderItem = useCallback(({item}: ListRenderItemInfo<IMessage>) => {
    return <Item data={item} />;
  }, []);
  const keyExtractor = useCallback((item: IMessage) => item.id, []);
  const onEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    dispatch({
      type: 'message/getMessages',
      payload: {
        loadMore: true,
      },
    });
  }, [dispatch, hasMore, loading]);
  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty
          source={EmptyIcon}
          containerStyle={styles.empty}
          message={`暂无${activeIndex === 0 ? '消息' : '公告'}～`}
        />
      ),
    [loading, activeIndex, hasMore],
  );
  const footer = useMemo(() => {
    if (!hasMore) {
      return null;
    }
    if (loading && hasMore) {
      if (activeIndex === 0 && messageList.length > 0) {
        return <Loading />;
      }
      if (activeIndex === 1 && noticeList.length > 0) {
        return <Loading />;
      }
    }
  }, [activeIndex, hasMore, loading, messageList.length, noticeList.length]);

  const [readAllVisible, setReadAllVisible] = useState(false);
  const readAllClick = useCallback(() => {
    if (unReadInfo.messageCount <= 0 && unReadInfo.noticeCount <= 0) {
      return;
    }
    setReadAllVisible(true);
  }, [unReadInfo.messageCount, unReadInfo.noticeCount]);
  const onReadAllConfirm = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const scrollRef = useRef<FlatList<IMessage>>();
  // 我的消息和系统公告切换
  const handleTabClick = useCallback(
    (index: number) => {
      dispatch({
        type: 'message/changeActiveIndex',
        payload: {
          index,
        },
        callback: () =>
          InteractionManager.runAfterInteractions(() => {
            setRefreshing(false);
            InteractionManager.runAfterInteractions(() => {
              scrollRef.current?.scrollToOffset({
                offset: 0,
              });
            });
          }),
      });
      InteractionManager.runAfterInteractions(() => {
        setRefreshing(true);
      });
    },
    [dispatch, scrollRef],
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        dispatch({
          type: 'message/getMessages',
          callback: () => setRefreshing(false),
        });
        dispatch({
          type: 'message/getUnReadCount',
        });
      });

      return () => task.cancel();
    }, [dispatch]),
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.tabbar}>
          <View style={styles.tabbar_inner}>
            <TabBarItem
              title="我的消息"
              activeIndex={activeIndex}
              index={0}
              unReadCount={unReadInfo.messageCount}
              tabClick={handleTabClick}
            />
            <TabBarItem
              title="系统公告"
              activeIndex={activeIndex}
              index={1}
              unReadCount={unReadInfo.noticeCount}
              tabClick={handleTabClick}
            />
          </View>
          <View style={styles.read}>
            <Touchable onPress={readAllClick}>
              <IconFont name="icon-yidu" size={20} />
            </Touchable>
          </View>
        </View>
        {activeIndex === 0 ? <Carousel /> : null}
        <FlatList
          ref={scrollRef as React.LegacyRef<FlatList<IMessage>>}
          style={styles.list}
          ListFooterComponent={footer}
          ListEmptyComponent={empty}
          data={activeIndex === 0 ? messageList : noticeList}
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
      </View>
      <ReadAllMsgModal
        visible={readAllVisible}
        setVisible={setReadAllVisible}
        onConfirm={onReadAllConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: getStatusBarHeight(),
  },
  tabbar: {
    paddingTop: 30,
    paddingHorizontal: 15,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabbar_inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  read: {
    flex: 1,
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  empty: {
    paddingTop: 150,
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

export default Message;
