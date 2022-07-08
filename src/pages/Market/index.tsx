import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  InteractionManager,
  StatusBar,
  ScrollView,
  RefreshControl,
  FlatList,
  ListRenderItemInfo,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import {createSelector} from 'reselect';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'lodash';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {IMarketTab} from '@/models/market';
import Empty from '@/components/Empty';
import {ampHundred} from '@/utils/index';
import IconFont from '@/assets/iconfont';
import Sort0Icon from '@/assets/image/market/sort0.png';
import Sort1Icon from '@/assets/image/market/sort1.png';
import Sort2Icon from '@/assets/image/market/sort2.png';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
  rootNavigation: RootStackNavigation;
}

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['market/getMarketList'],
);
const selectKeyword = createSelector(
  (state: RootState) => state.market,
  market => market.keyword,
);
const selectTabList = createSelector(
  (state: RootState) => state.market,
  market => market.tabList,
);
const selectCurTabId = createSelector(
  (state: RootState) => state.market,
  market => market.curTabId,
);
const selectSortName = createSelector(
  (state: RootState) => state.market,
  market => market.sortName,
);
const selectSortValue = createSelector(
  (state: RootState) => state.market,
  market => market.sortValue,
);

const Market: React.FC<IProps> = ({navigation, rootNavigation}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const tabList = useSelector(selectTabList);
  const curTabId = useSelector(selectCurTabId);

  const keyword = useSelector(selectKeyword);
  const doSearch = useCallback(
    debounce(() => {
      dispatch({
        type: 'market/getMarketList',
      });
    }, 300),
    [dispatch],
  );
  const onSearch = useCallback(
    value => {
      dispatch({
        type: 'market/setState',
        payload: {
          keyword: value,
        },
      });
      doSearch();
    },
    [dispatch, doSearch],
  );
  const headerRight = useMemo(
    () => (
      <View style={styles.search_box}>
        <IconFont name="icon-sousuo" color="#999" size={15} />
        <TextInput
          style={styles.search_input}
          placeholder="请输入关键字搜索"
          placeholderTextColor="#999"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          onChangeText={onSearch}
          value={keyword}
        />
      </View>
    ),
    [keyword, onSearch],
  );

  const scrollRef = useRef<ScrollView>();
  const choseTab = useCallback(
    (item: IMarketTab, index) => {
      InteractionManager.runAfterInteractions(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(index - 1, 0) * 60,
          y: 0,
        });
      });
      dispatch({
        type: 'market/setState',
        payload: {
          curTabId: item.id,
        },
      });
    },
    [dispatch],
  );
  useEffect(() => {
    let index = tabList.findIndex(item => item.id === curTabId);
    if (index > -1) {
      InteractionManager.runAfterInteractions(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(index - 1, 0) * 60,
          y: 0,
          animated: false,
        });
      });
    }
  }, [curTabId, tabList]);

  const sortName = useSelector(selectSortName);
  const sortValue = useSelector(selectSortValue);
  // 排序
  const sortChange = useCallback(
    (name: string) => {
      dispatch({
        type: 'market/sortList',
        payload: {
          sortName: name,
        },
      });
    },
    [dispatch],
  );

  const curList = useMemo(() => {
    return tabList.find(item => item.id === curTabId)?.listAddRes ?? [];
  }, [curTabId, tabList]);
  const [hasMore, setHasMore] = useState(true);
  // 刷新
  const onRefresh = useCallback(() => {
    dispatch({
      type: 'market/getMarketList',
    });
  }, [dispatch]);

  const renderItem = useCallback(({item}: ListRenderItemInfo<IMarket>) => {
    return (
      <Touchable style={styles.item}>
        <View style={styles.item_summary}>
          <View style={styles.item_symbols}>
            <Text style={styles.item_symbol}>{item.symbol}</Text>
            <Text style={styles.item_refer_currency}>
              /{item.referCurrency}
            </Text>
            {item.exchangeName ? (
              <View style={styles.exchange}>
                <Text style={styles.exchange_name}>{item.exchangeName}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.item_volume}>24h量：{item.volume}</Text>
        </View>
        <Text
          style={[
            styles.item_last_price,
            +item.percent24h >= 0
              ? GlobalStyles.up_color
              : GlobalStyles.down_color,
          ]}>
          {item.lastPrice}
        </Text>
        <View
          style={[
            styles.item_percent,
            +item.percent24h >= 0
              ? GlobalStyles.up_bg_color
              : GlobalStyles.down_bg_color,
          ]}>
          <Text style={styles.item_percent_txt}>
            {ampHundred(item.percent24h)}%
          </Text>
        </View>
      </Touchable>
    );
  }, []);
  const keyExtractor = useCallback((item: IMarket) => item.id.toString(), []);
  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty containerStyle={styles.empty} message="暂无币对~" />
      ),
    [loading, hasMore],
  );
  const itemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        rootNavigation.setOptions({
          headerRight: () => headerRight,
        });
      });
      return () => task.cancel();
    }, [headerRight, rootNavigation]),
  );
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          dispatch({
            type: 'market/getMarketList',
            callback: () => {
              setHasMore(false);
            },
          });
        }, 0);
      });
      return () => task.cancel();
    }, [dispatch]),
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.tabs_box}>
        <ScrollView
          ref={scrollRef as React.LegacyRef<ScrollView>}
          contentContainerStyle={[styles.tabs_scroll]}
          style={GlobalStyles.flex_1}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {tabList.map((item, index) => (
            <Touchable key={item.id} onPress={() => choseTab(item, index)}>
              <View
                style={[
                  styles.tab_item,
                  curTabId === item.id ? styles.tab_item_active : null,
                ]}>
                <Text
                  style={[
                    styles.tab_item_txt,
                    curTabId === item.id ? styles.tab_item_txt_active : null,
                  ]}>
                  {item.name}
                </Text>
              </View>
            </Touchable>
          ))}
        </ScrollView>
        <Touchable style={styles.more}>
          <IconFont name="icon-more-dot" size={22} />
        </Touchable>
      </View>
      <View style={[GlobalStyles.flex_row, styles.list_header]}>
        <Text style={styles.header_summary}>币对/24H量</Text>
        <Touchable
          onPress={() => sortChange('price')}
          style={[GlobalStyles.flex_row, styles.header_last_price]}>
          <Text style={styles.header_last_price_txt}>行情(USDT)</Text>
          <Image
            style={styles.header_sort_icon}
            source={
              sortName !== 'price'
                ? Sort0Icon
                : sortValue === '0'
                ? Sort1Icon
                : Sort2Icon
            }
          />
        </Touchable>
        <Touchable
          onPress={() => sortChange('upDown')}
          style={[GlobalStyles.flex_row, styles.header_volumn]}>
          <Text style={styles.header_volumn_txt}>24h涨跌</Text>
          <Image
            style={styles.header_sort_icon}
            source={
              sortName !== 'upDown'
                ? Sort0Icon
                : sortValue === '0'
                ? Sort1Icon
                : Sort2Icon
            }
          />
        </Touchable>
      </View>
      <FlatList
        style={styles.list}
        data={curList}
        renderItem={renderItem}
        refreshing={loading}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={!!loading}
            onRefresh={onRefresh}
            colors={[themeColor]}
            tintColor={themeColor}
          />
        }
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={empty}
      />
    </>
  );
};

const styles = StyleSheet.create({
  tabs_box: {
    position: 'relative',
    borderColor: '#EFEFEF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 51,
  },
  tabs_scroll: {
    paddingLeft: 4,
    paddingRight: 15,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab_item: {
    height: 25,
    justifyContent: 'center',
    marginLeft: 11,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  tab_item_active: {
    backgroundColor: '#F9F3E8',
  },
  tab_item_txt: {
    color: '#ABADB5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  tab_item_txt_active: {
    color: themeColor,
  },
  more: {
    padding: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header_title: {
    fontSize: 23,
    lineHeight: 23,
    fontWeight: 'bold',
    margin: 0,
    flex: 1,
  },
  search_box: {
    paddingHorizontal: 11,
    width: 181,
    height: 34,
    backgroundColor: '#F5F5F5',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  search_input: {
    marginLeft: 8,
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  empty: {
    paddingTop: 150,
  },
  item: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_summary: {
    flex: 1,
  },
  item_symbols: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_symbol: {
    fontSize: 16,
    color: '#333',
    lineHeight: 18,
    fontFamily: 'HelveticaNeue-Medium',
    fontWeight: 'bold',
  },
  item_refer_currency: {
    fontSize: 12,
    color: '#CACDD1',
    lineHeight: 14,
    fontFamily: 'ArialMT',
    marginLeft: 2,
  },
  exchange: {
    height: 15,
    borderRadius: 2,
    backgroundColor: '#D59420',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    marginLeft: 5,
  },
  exchange_name: {
    color: '#fff',
    fontSize: 9,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  item_volume: {
    marginTop: 7,
    fontSize: 12,
    color: '#A8ACBB',
    lineHeight: 17,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  item_last_price: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    paddingLeft: 9,
  },
  item_percent: {
    width: 70,
    height: 31,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  item_percent_txt: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E6E6E6',
  },
  list_header: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 9,
  },
  header_summary: {
    flex: 1,
    color: '#ABADB5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  header_last_price: {},
  header_last_price_txt: {
    color: '#ABADB5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  header_sort_icon: {
    width: 8,
    height: 10,
    marginLeft: 5,
  },
  header_volumn: {
    width: 70,
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  header_volumn_txt: {
    color: '#ABADB5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
});

export default Market;
