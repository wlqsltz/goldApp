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
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';
import {SCREEN_WIDTH, themeColor} from '@/utils/index';
import GlobalStyles from '@/assets/style/global';
import BgIcon from '@/assets/image/home/electronicBilling/bg.png';
import useHeaderPaddingTopStyle from '@/utils/hooks/useHeaderPaddingTopStyle';
import IconFont from '@/assets/iconfont';
import {xstrategyCycleHisPage, xstrategyDayIncome} from '@/api/trade';
import Empty from '@/components/Empty';
import dayjs from 'dayjs';
import Loading from '@/components/Loading';
import Item from './components/Item';
import Touchable from '@/components/Touchable';

interface IProps {
  navigation: RootStackNavigation;
}

const Billing: React.FC<IProps> = ({navigation}) => {
  const [dayIncome, setDayIncome] = useState<IDayIncome>({
    todayIncome: '--',
    totalIncome: '--',
    currency: 'USDT',
    pairDayIncomeList: [],
  });

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
        const params: IPageParams = {
          pageNum: page,
          currentDate: dayjs().format('YYYY-MM-DD'),
        };
        const data: any = await xstrategyCycleHisPage(params);

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
        const data: any = await xstrategyDayIncome();
        setDayIncome(data);
      } catch (error) {}
    };
    const task = InteractionManager.runAfterInteractions(refreshData);
    return () => task.cancel();
  }, []);
  useEffect(() => {
    const refreshData = async () => {
      try {
        setRefreshing(true);
        const data: any = await xstrategyCycleHisPage({
          pageNum: 1,
          currentDate: dayjs().format('YYYY-MM-DD'),
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

  const goEverydayProfit = useCallback(() => {
    navigation.navigate('EverydayProfit', {
      currency: dayIncome.currency,
      totalIncome: dayIncome.totalIncome,
    });
  }, [dayIncome.currency, dayIncome.totalIncome, navigation]);
  const goSymbolsProfit = useCallback(() => {
    navigation.navigate('SymbolsProfit');
  }, [navigation]);

  const padTopStyle = useHeaderPaddingTopStyle();
  return (
    <View style={GlobalStyles.flex_1}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        style={[
          GlobalStyles.flex_row,
          GlobalStyles.flex_jc_sb,
          styles.bg,
          padTopStyle,
        ]}
        source={BgIcon}>
        <View>
          <Text style={styles.head_title}>
            今日总盈利({dayIncome.currency})
          </Text>
          <Text style={styles.head_txt}>{dayIncome.todayIncome}</Text>
        </View>
        <View style={styles.head_item}>
          <Text style={styles.head_title}>
            累计总盈利({dayIncome.currency})
          </Text>
          <Text style={styles.head_txt}>{dayIncome.totalIncome}</Text>
        </View>
      </ImageBackground>
      <View style={[GlobalStyles.flex_row, GlobalStyles.bg_fff, styles.tabbar]}>
        <Touchable
          onPress={goEverydayProfit}
          style={[
            GlobalStyles.flex_1,
            GlobalStyles.flex_row,
            GlobalStyles.flex_jc_center,
          ]}>
          <IconFont name="icon-leiji" size={22} />
          <Text style={styles.tab_title}>每日盈利分布</Text>
        </Touchable>
        <View style={styles.tab_line} />
        <Touchable
          onPress={goSymbolsProfit}
          style={[
            GlobalStyles.flex_1,
            GlobalStyles.flex_row,
            GlobalStyles.flex_jc_center,
          ]}>
          <IconFont name="icon-bidui" size={22} />
          <Text style={styles.tab_title}>币对盈利分布</Text>
        </Touchable>
      </View>
      <View
        style={[
          styles.sub_title_box,
          GlobalStyles.bg_f7f7f7,
          GlobalStyles.ph15,
          GlobalStyles.flex_row,
        ]}>
        <View style={styles.line} />
        <Text style={styles.sub_title}>今日盈利列表</Text>
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
  bg: {
    width: SCREEN_WIDTH,
    height: 163 + getStatusBarHeight(),
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  head_item: {
    alignItems: 'flex-end',
  },
  head_title: {
    marginTop: 16,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    opacity: 0.8,
  },
  head_txt: {
    marginTop: 14,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 27,
  },
  tabbar: {
    height: 53,
  },
  tab_line: {
    width: StyleSheet.hairlineWidth,
    height: 53,
    backgroundColor: '#EDEDED',
  },
  tab_title: {
    marginLeft: 5,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    color: '#333',
  },
  sub_title_box: {
    paddingTop: 15,
    paddingBottom: 8,
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
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 15,
    paddingTop: 7,
  },
});

export default Billing;
