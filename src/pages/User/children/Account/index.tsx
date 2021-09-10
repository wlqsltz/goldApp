import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  StatusBar,
  RefreshControl,
  FlatList,
  ListRenderItemInfo,
  Image,
  ImageBackground,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import Empty from '@/components/Empty';
import EyeIcon from '@/assets/image/user/account/eye.png';
import EyeCloseIcon from '@/assets/image/user/account/eye-close.png';
import BgIcon from '@/assets/image/user/account/bg.png';
import EmptyIcon from '@/assets/image/user/account/empty.png';
import IconFont from '@/assets/iconfont';
import {SCREEN_WIDTH, showHideMoney} from '@/utils/index';
import useHeaderPaddingTopStyle from '@/utils/hooks/useHeaderPaddingTopStyle';
import {accountDetailByUser, jourMyPage} from '@/api/user';
import storage, {load} from '@/config/storage';
import {ACCOUNT_EYE} from '@/config/storageTypes';
import Loading from '@/components/Loading';
import Item from './components/Item';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

const Account: React.FC<IProps> = ({navigation}) => {
  const [isClose, setIsClose] = useState(false);
  const handleEyeClick = useCallback(() => {
    setIsClose(!isClose);
    storage.save({
      key: ACCOUNT_EYE,
      data: !isClose ? '1' : '0',
    });
  }, [isClose]);

  const [info, setInfo] = useState<IAccount>();
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
    accountDetailByUser('USDT').then(data => setInfo(data as IAccount));
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
          message="暂无流水～"
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

  const goBillList = useCallback(() => {
    navigation.navigate('BillList');
  }, [navigation]);
  const goCharge = useCallback(() => {
    if (!info) {
      return;
    }
    navigation.navigate('Charge', {
      accountNumber: info.accountNumber,
    });
  }, [info, navigation]);
  const goWithdrawal = useCallback(() => {
    navigation.navigate('Withdrawal');
  }, [navigation]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setRefreshing(true);
      load({
        key: ACCOUNT_EYE,
      }).then(data => {
        setIsClose(data === '1');
      });
      jourMyPage({
        pageNum: 1,
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
      accountDetailByUser('USDT').then(data => setInfo(data as IAccount));
    });
    return () => task.cancel();
  }, []);

  const padTopStyle = useHeaderPaddingTopStyle();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BgIcon} style={[styles.bg, padTopStyle]}>
        <Touchable
          onPress={handleEyeClick}
          ms={100}
          style={[GlobalStyles.flex_row, styles.title_box]}>
          <Text style={styles.title}>总资产(USDT)</Text>
          <Image source={isClose ? EyeCloseIcon : EyeIcon} style={styles.eye} />
        </Touchable>
        <Text style={styles.amount}>
          {showHideMoney(info?.amount, !isClose)}
        </Text>
        <Text style={styles.locked}>
          提币中：{showHideMoney(info?.withdrawalAmount, !isClose)}{' '}
          {info?.currency}
        </Text>
        <View style={[GlobalStyles.flex_row, styles.btns]}>
          <Touchable onPress={goCharge} style={styles.btn}>
            <Text style={styles.btn_txt}>充币</Text>
          </Touchable>
          <Touchable onPress={goWithdrawal} style={styles.btn}>
            <Text style={styles.btn_txt}>提币</Text>
          </Touchable>
          <Touchable style={styles.btn}>
            <Text style={styles.btn_txt}>互转</Text>
          </Touchable>
        </View>
      </ImageBackground>
      <View style={[GlobalStyles.flex_row, styles.header_box]}>
        <View style={GlobalStyles.flex_row}>
          <View style={styles.left_line} />
          <Text style={styles.header_title}>账户流水</Text>
        </View>
        <Touchable onPress={goBillList} style={GlobalStyles.flex_row}>
          <Text style={styles.more}>更多</Text>
          <IconFont name="icon-right" color="#999" size={12} />
        </Touchable>
      </View>
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
  bg: {
    height: 241 + getStatusBarHeight(),
    width: SCREEN_WIDTH,
    paddingHorizontal: 15,
  },
  title_box: {
    marginTop: 18,
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 17,
  },
  eye: {
    width: 12,
    height: 12,
    marginLeft: 4,
  },
  amount: {
    marginTop: 4,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 33,
  },
  locked: {
    marginTop: 3,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 19,
  },
  btns: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    paddingHorizontal: 7.5,
    height: 55,
    backgroundColor: 'rgba(213, 148, 32, 0.3)',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    marginHorizontal: 7.5,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: '#fff',
    borderWidth: 1,
  },
  btn_txt: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  header_box: {
    height: 53,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  left_line: {
    width: 3,
    height: 17,
    backgroundColor: themeColor,
    borderRadius: 2,
    marginRight: 9,
  },
  header_title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 23,
  },
  more: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
    marginRight: 2,
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
  },
  empty: {
    paddingTop: 150,
  },
});

export default Account;
