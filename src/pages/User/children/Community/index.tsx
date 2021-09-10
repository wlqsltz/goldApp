import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  FlatList,
  InteractionManager,
  RefreshControl,
  ListRenderItemInfo,
  Image,
} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackParamList, RootStackNavigation} from '@/navigator/index';
import BgIcon from '@/assets/image/user/community/bg.png';
import QzIcon from '@/assets/image/user/community/qz.png';
import {SCREEN_WIDTH} from '@/utils/index';
import useHeaderPaddingTopStyle from '@/utils/hooks/useHeaderPaddingTopStyle';
import GlobalStyles from '@/assets/style/global';
import {getMyCommunityList, myCommunityHead} from '@/api/user';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import Avatar from '@/components/Avatar';

const themeColor = '#D59420';

interface IEntity {
  id: string;
  isChannel: '0' | '1';
  mobile: string;
  nickname: string;
  photo: string;
  todayIncome: string;
  totalIncome: string;
}
interface ISummary {
  communityTodayIncome: string;
  communityTotalIncome: string;
  count: number;
  isSHow: string;
  ranking: number;
  todayIncome: string;
  totalIncome: string;
}

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'Community'>;
}

const PARALLAX_HEADER_HEIGHT = 268 + getStatusBarHeight();

const Community: React.FC<IProps> = ({navigation, route}) => {
  const {isChannel} = route.params;
  const padTopStyle = useHeaderPaddingTopStyle();

  const [list, setList] = useState<IEntity[]>([]);
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
        const data: any = await getMyCommunityList({
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
    return (
      <View style={[styles.item, GlobalStyles.flex_row]} key={item.id}>
        <View style={[styles.list_th_id, GlobalStyles.flex_row]}>
          <Avatar style={styles.item_avatar} uri={item.photo} />
          <Image source={QzIcon} style={styles.qz_icon} />
          <Text style={styles.item_nickname}>{item.nickname}</Text>
        </View>
        <View style={styles.list_th_total}>
          <Text style={styles.item_txt}>{item.totalIncome}</Text>
        </View>
        <View style={styles.list_th_today}>
          <Text style={styles.item_txt}>{item.todayIncome}</Text>
        </View>
      </View>
    );
  }, []);
  const keyExtractor = useCallback((item: IEntity) => item.id, []);
  const onEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    getPageList();
  }, [getPageList, hasMore, loading]);
  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty containerStyle={styles.empty} message={'暂无社群成员～'} />
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

  const [summary, setSummary] = useState<ISummary>();
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        try {
          myCommunityHead().then(data => {
            setSummary(data as ISummary);
          });
          setRefreshing(true);
          const data: any = await getMyCommunityList({
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
    <View style={styles.container}>
      <ImageBackground source={BgIcon} style={styles.bg}>
        <View style={[styles.parallaxHeader, padTopStyle]}>
          <Text style={styles.rank_title}>当前排名</Text>
          <Text style={styles.rank}>{summary?.ranking ?? '--'}</Text>
          <View style={styles.profit}>
            <View style={styles.profit_item}>
              <Text style={styles.profit_title}>今日收益：</Text>
              <Text style={styles.profit_value}>
                {summary?.communityTodayIncome ?? '--'}
              </Text>
            </View>
            <View style={styles.profit_item}>
              <Text style={styles.profit_title}>总收益：</Text>
              <Text style={styles.profit_value}>
                {summary?.communityTotalIncome ?? '--'}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.content}>
        {isChannel === '1' ? (
          <View style={styles.profit_bottom}>
            <View style={styles.profit_b_item}>
              <Text style={styles.profit_b_title}>昨日奖励</Text>
              <Text style={styles.profit_b_value}>
                {summary?.todayIncome ?? '--'}
              </Text>
            </View>
            <View style={styles.profit_b_item}>
              <Text style={styles.profit_b_title}>累计奖励</Text>
              <Text style={styles.profit_b_value}>
                {summary?.totalIncome ?? '--'}
              </Text>
            </View>
          </View>
        ) : null}
        <View
          style={[
            styles.list_header,
            isChannel === '1' && styles.list_header_mt9,
          ]}>
          <View style={styles.list_header_top}>
            <Text style={styles.list_header_title}>社群成员</Text>
            <Text style={styles.list_header_sub_title}>
              ({summary?.count ?? '--'}人)
            </Text>
          </View>
          <View style={styles.list_header_bottom}>
            <View style={styles.list_th_id}>
              <Text style={styles.list_th}>用户ID</Text>
            </View>
            <View style={styles.list_th_total}>
              <Text style={styles.list_th}>累计收益(USDT)</Text>
            </View>
            <View style={styles.list_th_today}>
              <Text style={styles.list_th}>今日收益(USDT)</Text>
            </View>
          </View>
        </View>
        <FlatList
          style={GlobalStyles.flex_1}
          ListFooterComponent={footer}
          ListEmptyComponent={empty}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: SCREEN_WIDTH,
    height: PARALLAX_HEADER_HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  parallaxHeader: {
    paddingHorizontal: 15,
    flex: 1,
  },
  rank_title: {
    marginTop: 10,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 17,
  },
  rank: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 47,
  },
  content: {
    marginTop: -54,
    flex: 1,
  },
  profit: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 13,
  },
  profit_item: {
    marginRight: 32,
  },
  profit_title: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 15,
    color: '#fff',
  },
  profit_value: {
    marginTop: 9,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 18,
    color: '#fff',
  },
  profit_bottom: {
    width: SCREEN_WIDTH,
    paddingLeft: 15,
    paddingRight: 13,
    height: 54,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 13,
  },
  profit_b_item: {
    flexDirection: 'row',
  },
  profit_b_title: {
    paddingTop: 3,
    marginRight: 7,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 17,
    color: '#fff',
  },
  profit_b_value: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 21,
    color: '#fff',
  },
  list_header: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 11,
    paddingTop: 17,
  },
  list_header_mt9: {
    marginTop: -9,
  },
  list_header_top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list_header_title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 23,
  },
  list_header_sub_title: {
    marginLeft: 7,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#A4A4AC',
    lineHeight: 19,
  },
  list_header_bottom: {
    marginTop: 12,
    flexDirection: 'row',
  },
  list_th: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#A4A4AC',
    lineHeight: 19,
  },
  list_th_id: {
    width: '40%',
  },
  list_th_total: {
    width: '30%',
  },
  list_th_today: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  empty: {
    paddingTop: 150,
  },
  item: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 11,
  },
  item_avatar: {
    marginLeft: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  qz_icon: {
    width: 26,
    height: 13,
    position: 'absolute',
    left: 7,
    bottom: -6.5,
  },
  item_nickname: {
    marginLeft: 5,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#333',
    lineHeight: 19,
  },
  item_txt: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#696874',
    lineHeight: 16,
    paddingRight: 4,
  },
});

export default Community;
