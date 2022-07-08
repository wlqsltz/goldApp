import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Animated,
  InteractionManager,
  ImageBackground,
  TextInput,
  Image,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {debounce} from 'lodash';
import {useFocusEffect} from '@react-navigation/core';
import {RootState} from '@/models/index';
import {IOptions, IXstrategy} from '@/models/strategy';
import {showHideMoney, themeColor, toast} from '@/utils/index';
import IconFont from '@/assets/iconfont';
import GlobalStyles from '@/assets/style/global';
import storage, {load} from '@/config/storage';
import {STRATEGY_EYE} from '@/config/storageTypes';
import HbBgIcon from '@/assets/image/strategy/hb-bg.png';
import EyeIcon from '@/assets/image/strategy/eye.png';
import EyeCloseIcon from '@/assets/image/strategy/eye-close.png';
import CheckIcon from '@/assets/image/strategy/check.png';
import CheckOnIcon from '@/assets/image/strategy/check-on.png';
import FilterIcon from '@/assets/image/strategy/filter.png';
import Touchable from '@/components/Touchable';
import Empty from '@/components/Empty';
import Drawer from '@/components/Drawer';
import Item from './components/Item';
import BatchOptions from './components/BatchOptions';
import BatchStopModal from './components/BatchStopModal';
import ClearModal from './components/ClearModal';
import Filter from './components/Filter';
import OverdueModal from './components/OverdueModal';
import BindExchange from './components/BindExchange';

const headerHeight = 203;

interface IProps {
}

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['strategy/getInitData'],
);
// 页面的数据
const selectData = createSelector(
  (state: RootState) => state.strategy,
  strategy => strategy.data,
);
// 当前选择的交易所id
const selectCurId = createSelector(
  (state: RootState) => state.strategy,
  strategy => strategy.curId,
);
// 搜索关键字
const selectKeyword = createSelector(
  (state: RootState) => state.strategy,
  strategy => strategy.keyword,
);
// apikey是否过期
const selectApiKeyStatus = createSelector(
  (state: RootState) => state.user,
  user => user.user?.apiKeyStatus,
);
// 用户已经绑定的apikey列表
const selectApiKeyList = createSelector(
  (state: RootState) => state.user,
  user => user.apiKeyList,
);

const Strategy: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const curId = useSelector(selectCurId);
  const apiKeyStatus = useSelector(selectApiKeyStatus); // api是否过期
  const apiKeyList = useSelector(selectApiKeyList);

  // 是否未绑定api
  const unBindKey = useMemo(() => {
    if (!curId || !apiKeyList) {
      return false;
    }
    return apiKeyList.findIndex(item => item.exchangeNo === curId) < 0;
  }, [apiKeyList, curId]);
  // 头部资金信息
  const xstrategyInfo = useMemo(() => {
    return data[curId]?.headData;
  }, [curId, data]);
  // 币对列表
  const xstrategyList = useMemo(() => {
    return data[curId]?.listData ?? [];
  }, [curId, data]);
  // 当前选中的币对id
  const choseIdList = useMemo(() => {
    return data[curId]?.choseIdList ?? [];
  }, [curId, data]);
  // 当前批量操作的币对列表
  const [batchList, setBatchList] = useState<IXstrategy[]>([]);

  const [isClose, setIsClose] = useState(false);
  const handleEyeClick = useCallback(() => {
    setIsClose(!isClose);
    storage.save({
      key: STRATEGY_EYE,
      data: !isClose ? '1' : '0',
    });
  }, [isClose]);

  // 全选
  const handleToggleAll = useCallback(() => {
    dispatch({
      type: 'strategy/toggleAll',
    });
  }, [dispatch]);
  // 选择某个币对
  const handleToggleItem = useCallback(
    (id: string) => {
      dispatch({
        type: 'strategy/toggleItem',
        payload: {
          id,
        },
      });
    },
    [dispatch],
  );
  // 点击某个币对的设置止损价
  const goSetting = useCallback((item: IXstrategy) => {
    setBatchList([item]);
    setStopVisible(true);
  }, []);
  // 点击批量设置止损
  const handleBatchSetting = useCallback(() => {
    const list = choseIdList.map(id => {
      return xstrategyList.find(item => item.id === id);
    }) as IXstrategy[];
    setBatchList(list);
    setStopVisible(true);
  }, [choseIdList, xstrategyList]);
  // 点击批量清仓
  const handleBatchClear = useCallback(() => {
    const list = choseIdList.map(id => {
      return xstrategyList.find(item => item.id === id);
    }) as IXstrategy[];
    setBatchList(list);
    setClearVisible(true);
  }, [choseIdList, xstrategyList]);

  const renderItem = useCallback(
    (item: IXstrategy) => {
      return (
        <Item
          key={item.id}
          data={item}
          chosed={choseIdList.includes(item.id)}
          toggleItem={handleToggleItem}
          goSetting={goSetting}
        />
      );
    },
    [choseIdList, goSetting, handleToggleItem],
  );
  const onRefresh = useCallback(() => {
    dispatch({
      type: 'strategy/getInitData',
    });
  }, [dispatch]);

  const [stopVisible, setStopVisible] = useState(false);
  const onStopConfirm = useCallback(() => {
    toast('设置成功');
    onRefresh();
  }, [onRefresh]);
  const [clearVisible, setClearVisible] = useState(false);
  const onClearConfirm = useCallback(() => {
    toast('清仓成功');
    onRefresh();
  }, [onRefresh]);

  // 筛选
  const [filterOpen, setFilterOpen] = useState(false);
  const showFilter = useCallback(() => {
    setFilterOpen(true);
  }, []);
  const onOpenChange = useCallback((open: boolean) => {
    setFilterOpen(open);
  }, []);
  const options = useMemo(() => {
    return data[curId]?.options;
  }, [curId, data]);
  const onFilterCancel = useCallback(() => {
    setFilterOpen(false);
  }, []);
  const onFilterConfirm = useCallback(
    (_options: IOptions) => {
      setFilterOpen(false);
      dispatch({
        type: 'strategy/changeOptions',
        payload: _options,
      });
    },
    [dispatch],
  );
  const sidebar = useMemo(() => {
    return options ? (
      <Filter
        open={filterOpen}
        options={options}
        onCancel={onFilterCancel}
        onConfirm={onFilterConfirm}
      />
    ) : null;
  }, [filterOpen, onFilterCancel, onFilterConfirm, options]);

  // 搜索
  const keyword = useSelector(selectKeyword);
  const doSearch = useCallback(
    debounce(() => {
      dispatch({
        type: 'strategy/getInitData',
      });
    }, 300),
    [dispatch],
  );
  const onSearch = useCallback(
    value => {
      dispatch({
        type: 'strategy/setState',
        payload: {
          keyword: value,
        },
      });
      doSearch();
    },
    [dispatch, doSearch],
  );

  // api过期弹窗
  const [overdueVisible, setOverdueVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        apiKeyStatus && setOverdueVisible(true);
      });
      return () => task.cancel();
    }, [apiKeyStatus]),
  );

  useFocusEffect(
    useCallback(() => {
      if (unBindKey) {
        return;
      }
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          dispatch({
            type: 'strategy/getInitData',
          });
        }, 0);
        load({
          key: STRATEGY_EYE,
        }).then(d => {
          setIsClose(d === '1');
        });
      });
      return () => task.cancel();
    }, [dispatch, unBindKey]),
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Drawer open={filterOpen} onOpenChange={onOpenChange} sidebar={sidebar}>
          {/* 交易所tab 和 搜索框 */}
          <View style={styles.tabbar}>
            <ImageBackground
              source={HbBgIcon}
              style={styles.head_bg}
              imageStyle={styles.head_bg_img}
            />
            <View style={[GlobalStyles.flex_row, styles.tabbar_inner]}>
              {Object.keys(data).map(key => (
                <Touchable style={styles.tabbar_item}>
                  <Text
                    style={[
                      styles.tabbar_item_txt,
                      styles.tabbar_item_txt_active,
                    ]}>
                    {data[key].name}
                  </Text>
                  <View
                    style={[styles.tabbar_line, styles.tabbar_line_active]}
                  />
                </Touchable>
              ))}
            </View>
            {unBindKey ? null : (
              <View style={styles.tabbar_search}>
                <IconFont
                  name="icon-sousuo"
                  size={11}
                  color="rgba(255, 255, 255, 0.6)"
                />
                <TextInput
                  style={styles.sarch_input}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  placeholder="请输入交易币种搜索"
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                  onChangeText={onSearch}
                  value={keyword}
                />
              </View>
            )}
          </View>
          {unBindKey ? (
            <BindExchange exchangeNo={curId} />
          ) : (
            <Animated.ScrollView
              style={styles.list}
              stickyHeaderIndices={[1]}
              refreshControl={
                <RefreshControl
                  refreshing={!!loading}
                  onRefresh={onRefresh}
                  colors={[themeColor]}
                  tintColor={themeColor}
                />
              }>
              {/* 头部资产信息 */}
              <View style={styles.list_header}>
                <ImageBackground
                  style={[styles.ab_img_bg]}
                  imageStyle={styles.ab_img}
                  source={HbBgIcon}
                />
                <View style={GlobalStyles.ph15}>
                  <Touchable
                    onPress={handleEyeClick}
                    style={GlobalStyles.flex_row}>
                    <Text style={styles.sub_title}>
                      账户权益<Text style={styles.sub_title_unit}>USDT</Text>
                    </Text>
                    <Image
                      source={isClose ? EyeCloseIcon : EyeIcon}
                      style={styles.eye}
                    />
                  </Touchable>
                  <Text style={styles.assets}>
                    {showHideMoney(xstrategyInfo?.assets, !isClose)}
                  </Text>
                  <View style={[styles.amount_box, GlobalStyles.flex_row]}>
                    <Text style={styles.amount_title}>持仓总盈亏</Text>
                    <Text style={styles.amount}>
                      {isClose
                        ? showHideMoney(xstrategyInfo?.assets, !isClose)
                        : !xstrategyInfo
                        ? '--'
                        : +xstrategyInfo.plAmount > 0
                        ? `+${xstrategyInfo.plAmount}`
                        : xstrategyInfo.plAmount}
                    </Text>
                    <Text style={styles.rate}>
                      {isClose
                        ? showHideMoney(xstrategyInfo?.plAmountRate, !isClose)
                        : !xstrategyInfo
                        ? '--'
                        : +xstrategyInfo.plAmountRate > 0
                        ? `+${xstrategyInfo.plAmountRate}%`
                        : `${xstrategyInfo.plAmountRate}%`}
                    </Text>
                  </View>
                </View>
                <View style={[styles.header_bottom, GlobalStyles.flex_row]}>
                  <View style={[styles.header_item, GlobalStyles.flex_row]}>
                    <Text style={styles.item_title}>可用余额</Text>
                    <Text style={styles.item_txt}>
                      {showHideMoney(xstrategyInfo?.balance, !isClose)}
                    </Text>
                  </View>
                  <View style={styles.header_line} />
                  <View style={[styles.header_item, GlobalStyles.flex_row]}>
                    <Text style={styles.item_title}>持仓金额</Text>
                    <Text style={styles.item_txt}>
                      {showHideMoney(xstrategyInfo?.entrustAmount, !isClose)}
                    </Text>
                  </View>
                </View>
              </View>
              {/* 全选、筛选 */}
              <View style={[GlobalStyles.ph15, GlobalStyles.bg_fff]}>
                <View style={[GlobalStyles.flex_row, styles.sub_tabbar]}>
                  <Touchable
                    onPress={handleToggleAll}
                    ms={100}
                    style={GlobalStyles.flex_row}>
                    <Image
                      style={styles.check_icon}
                      source={
                        xstrategyList.length === choseIdList.length &&
                        xstrategyList.length > 0
                          ? CheckOnIcon
                          : CheckIcon
                      }
                    />
                    <Text style={styles.check_txt}>全选</Text>
                  </Touchable>
                  <Touchable
                    onPress={showFilter}
                    ms={200}
                    style={GlobalStyles.flex_row}>
                    <Image style={styles.filter_icon} source={FilterIcon} />
                    <Text style={styles.check_txt}>筛选</Text>
                  </Touchable>
                </View>
              </View>
              {xstrategyList.map(renderItem)}
              {loading || xstrategyList.length ? null : (
                <View style={GlobalStyles.flex_ai_center}>
                  <Empty containerStyle={styles.empty} message="暂无仓位" />
                  <Touchable style={styles.empty_btn}>
                    <Text style={styles.empty_btn_txt}>去建仓</Text>
                  </Touchable>
                </View>
              )}
            </Animated.ScrollView>
          )}
          {choseIdList.length ? (
            <BatchOptions
              count={choseIdList.length}
              handleSetting={handleBatchSetting}
              handleClear={handleBatchClear}
            />
          ) : null}
        </Drawer>
      </View>
      {curId ? (
        <>
          <BatchStopModal
            visible={stopVisible}
            setVisible={setStopVisible}
            list={batchList}
            onConfirm={onStopConfirm}
          />
          <ClearModal
            visible={clearVisible}
            setVisible={setClearVisible}
            list={batchList}
            onConfirm={onClearConfirm}
          />
        </>
      ) : null}
      {apiKeyStatus ? (
        <OverdueModal
          visible={overdueVisible}
          setVisible={setOverdueVisible}
          apiKeyStatus={apiKeyStatus}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head_bg: {
    width: '100%',
    height: 223 + getStatusBarHeight(),
    position: 'absolute',
    left: 0,
    top: 0,
  },
  head_bg_img: {
    resizeMode: 'cover',
    alignSelf: 'flex-end',
  },
  tabbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tabbar_inner: {
    paddingTop: getStatusBarHeight() + 30,
    paddingHorizontal: 15,
  },
  tabbar_item: {
    alignItems: 'center',
    paddingBottom: 2,
    marginRight: 25,
  },
  tabbar_item_txt: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    opacity: 0.6,
  },
  tabbar_item_txt_active: {
    color: '#fff',
    fontSize: 18,
    opacity: 1,
  },
  tabbar_line: {
    height: 4,
    width: 18,
    borderRadius: 1,
    marginTop: 4,
  },
  tabbar_line_active: {
    backgroundColor: '#fff',
  },
  tabbar_search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 17,
    width: 190,
    paddingHorizontal: 14,
    marginTop: getStatusBarHeight() + 12,
    marginRight: 15,
    paddingVertical: 7,
  },
  sarch_input: {
    flex: 1,
    paddingLeft: 3,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ab_img_bg: {
    width: '100%',
    height: 223 + getStatusBarHeight(),
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  ab_img: {
    resizeMode: 'cover',
    alignSelf: 'flex-end',
  },
  header_box: {
    height: headerHeight,
  },
  list_header: {
    overflow: 'hidden',
    paddingTop: 28,
    position: 'relative',
  },
  sub_title: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
    marginRight: 1,
    opacity: 0.7,
  },
  sub_title_unit: {
    marginLeft: 1,
  },
  eye: {
    width: 14,
    height: 14,
    opacity: 0.7,
  },
  assets: {
    marginTop: 1,
    color: '#fff',
    fontSize: 25,
    lineHeight: 29,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
  },
  amount_box: {
    marginTop: 11,
    marginBottom: 19,
  },
  amount_title: {
    color: '#fff',
    opacity: 0.7,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
    marginRight: 3,
  },
  amount: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    color: '#fff',
  },
  rate: {
    marginLeft: 4,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    color: '#FFF3AF',
  },
  header_bottom: {
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
  },
  header_line: {
    height: 25,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  header_item: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 4,
  },
  item_title: {
    color: '#fff',
    fontSize: 12,
    marginRight: 5,
    fontFamily: 'PingFangSC-Regular',
  },
  item_txt: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
  },
  sub_tabbar: {
    paddingTop: 14,
    paddingBottom: 10,
    height: 41,
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  check_icon: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  check_txt: {
    color: '#ABADB5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  filter_icon: {
    width: 13,
    height: 13,
    marginRight: 5,
  },
  empty: {
    paddingTop: 82,
    paddingBottom: 19,
  },
  empty_btn: {
    width: 116,
    height: 36,
    backgroundColor: themeColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty_btn_txt: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 17,
  },
});

export default Strategy;
