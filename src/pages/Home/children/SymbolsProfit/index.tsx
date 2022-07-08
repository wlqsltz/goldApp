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
import {RootStackNavigation} from '@/navigator/index';
import {SCREEN_WIDTH, themeColor} from '@/utils/index';
import GlobalStyles from '@/assets/style/global';
import BgIcon from '@/assets/image/home/everydayProfit/bg.png';
import {xstrategyDayIncome} from '@/api/trade';
import Empty from '@/components/Empty';
import Item from './components/Item';

interface IProps {
  navigation: RootStackNavigation;
}

const SymbolsProfit: React.FC<IProps> = ({navigation}) => {
  const [dayIncome, setDayIncome] = useState<IDayIncome>({
    todayIncome: '--',
    totalIncome: '--',
    currency: 'USDT',
    pairDayIncomeList: [],
  });
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data: any = await xstrategyDayIncome();
      setDayIncome(data);
    } catch (error) {}
    setRefreshing(false);
  }, []);
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<IPairDayIncome>) => {
      return <Item data={item} />;
    },
    [],
  );
  const keyExtractor = useCallback(
    (item: IPairDayIncome, index: number) => index.toString(),
    [],
  );

  const empty = useMemo(
    () =>
      refreshing ? null : (
        <Empty containerStyle={GlobalStyles.empty} message="暂无盈利～" />
      ),
    [refreshing],
  );

  useEffect(() => {
    const refreshData = async () => {
      try {
        setRefreshing(true);
        const data: any = await xstrategyDayIncome();
        setDayIncome(data);
      } catch (error) {}
      setRefreshing(false);
    };
    const task = InteractionManager.runAfterInteractions(refreshData);
    return () => task.cancel();
  }, []);

  return (
    <View style={GlobalStyles.flex_1}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground style={styles.bg} source={BgIcon}>
        <Text style={styles.head_title}>累计盈利({dayIncome.currency})</Text>
        <Text style={styles.head_txt}>{dayIncome.totalIncome}</Text>
      </ImageBackground>
      <View
        style={[
          styles.sub_title_box,
          GlobalStyles.ph15,
          GlobalStyles.flex_row,
        ]}>
        <View style={styles.line} />
        <Text style={styles.sub_title}>币对盈利列表</Text>
      </View>
      <FlatList
        style={styles.list}
        ListEmptyComponent={empty}
        data={dayIncome.pairDayIncomeList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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

export default SymbolsProfit;
