import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  InteractionManager,
  Image,
  RefreshControl,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
// import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';
import {useHeaderHeight} from '@react-navigation/stack';
import {getElectronicBill} from '@/api/home';
import {useFocusEffect} from '@react-navigation/native';
import StrategyCard from './components/StrategyCard';
import Touchable from '@/components/Touchable';
import BgIcon from '@/assets/image/home/electronicBilling/bg.png';
import HistroyIcon from '@/assets/image/home/electronicBilling/history.png';
import BillItem from './components/BillItem';
import Empty from '@/components/Empty';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

const ElectronicBilling: React.FC<IProps> = ({navigation}) => {
  const headerHeight = useHeaderHeight();
  const padTopStyle = useMemo(() => {
    return {
      paddingTop: headerHeight,
    };
  }, [headerHeight]);

  const [info, setInfo] = useState<IElectronicBilling>({} as any); // 账单信息
  const [gdList, setGdList] = useState<IBillAccountItem[]>([]);
  const [tgList, setTgList] = useState<IBillAccountItem[]>([]);
  const [refreshing, setRefreshing] = useState(true); // 是否刷新中
  const [type, setType] = useState<'gd' | 'tg'>('gd');
  const currentList = useMemo<any[]>(
    () => (type === 'gd' ? gdList : tgList),
    [type, gdList, tgList],
  );
  const getData = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getElectronicBill();
      setInfo(data);
      setGdList(
        data.documentaryAccount
          .concat(data.documentaryAccount)
          .concat(data.documentaryAccount)
          .concat(data.documentaryAccount)
          .concat(data.documentaryAccount) || [],
      );
      setTgList(data.hostingAccount || []);
    } catch (error) {}
    setRefreshing(false);
  }, []);

  const goHistoryPage = useCallback(() => {
    // NavigatorUtil.goPage('ZhList', {
    //   type,
    // });
  }, [type]);

  const keyExtractor = useCallback(
    (item: IBillAccountItem) => item.accountId,
    [],
  );
  const header = useMemo(
    () => (
      <>
        <ImageBackground style={[styles.head_bg, padTopStyle]} source={BgIcon}>
          <View style={styles.bh_box}>
            <View style={styles.bh_single}>
              <Text style={styles.hs_txt}>今日总盈利(USDT)</Text>
              <Text style={styles.hs_btxt}>
                {info?.totalDayIncomeAmount || '--'}
              </Text>
            </View>
            <View style={styles.split} />
            <View style={styles.bh_single}>
              <Text style={styles.hs_txt}>累计总盈利(USDT)</Text>
              <Text style={styles.hs_btxt}>
                {info?.totalCumulativeIncome || '--'}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <StrategyCard info={info} />
        <View style={styles.tab_box}>
          <View style={styles.tab_box_inner}>
            <Touchable onPress={() => setType('gd')} style={styles.tab_item}>
              <Text
                style={[
                  styles.tab_txt,
                  type === 'gd' && styles.tab_txt_active,
                ]}>
                跟单账户
              </Text>
              <View style={[type === 'gd' && styles.tab_line]} />
            </Touchable>
            <Touchable onPress={() => setType('tg')} style={styles.tab_item}>
              <Text
                style={[
                  styles.tab_txt,
                  type === 'tg' && styles.tab_txt_active,
                ]}>
                托管账户
              </Text>
              <View style={[type === 'tg' && styles.tab_line]} />
            </Touchable>
            <Touchable onPress={goHistoryPage} style={styles.history_box}>
              <Image style={styles.history_icon} source={HistroyIcon} />
              <Text style={styles.history_text}>历史</Text>
            </Touchable>
          </View>
        </View>
      </>
    ),
    [goHistoryPage, info, padTopStyle, type],
  );
  const empty = useMemo(
    () =>
      refreshing ? null : (
        <Empty
          containerStyle={styles.empty}
          message={type === 'gd' ? '暂无跟单账户' : '暂无托管账户'}
        />
      ),
    [refreshing, type],
  );
  // 跟单、托管列表项
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<IBillAccountItem>) => {
      return <BillItem type={type} info={item} />;
    },
    [type],
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getData();
      });
      return () => task.cancel();
    }, [getData]),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        // ref={scrollRef as React.LegacyRef<FlatList<IMessage>>}
        style={styles.container}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        data={currentList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={getData}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getData}
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
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  head_bg: {
    height: 257,
    width: '100%',
  },
  bh_box: {
    marginTop: 20.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bh_single: {
    flex: 1,
    alignItems: 'center',
  },
  hs_txt: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 17,
  },
  hs_btxt: {
    marginTop: 4,
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 24,
    fontFamily: 'DINAlternate-Bold',
  },
  split: {
    width: 1,
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab_box: {
    height: 49,
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    marginTop: 14,
  },
  tab_box_inner: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    flex: 1,
    position: 'relative',
  },
  tab_item: {
    marginRight: 29,
    justifyContent: 'center',
    position: 'relative',
  },
  tab_txt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    color: '#BCBDC2',
    lineHeight: 23,
  },
  tab_txt_active: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 17,
    color: '#333333',
  },
  tab_line: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    width: 33,
    height: 3,
    backgroundColor: '#D59420',
    borderRadius: 1.5,
  },
  history_box: {
    position: 'absolute',
    right: 15,
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  history_icon: {
    height: 15,
    width: 16,
  },
  history_text: {
    marginLeft: 3,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    lineHeight: 20,
  },
  empty: {
    paddingTop: 80,
  },
});

export default ElectronicBilling;
