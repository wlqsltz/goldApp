import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  InteractionManager,
  StatusBar,
  RefreshControl,
  FlatList,
  ListRenderItemInfo,
  Text,
  View,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {RootStackNavigation} from '@/navigator/index';
import Empty from '@/components/Empty';
import {jourMyPage} from '@/api/user';
import Loading from '@/components/Loading';
import Item from '../Account/components/Item';
import EmptyIcon from '@/assets/image/user/account/empty.png';
import {getDictList} from '@/api/public';

interface IProps {
  navigation: RootStackNavigation;
}

const themeColor = '#D59420';
const placeholder = {
  label: '筛选',
  value: '',
};

const BillList: React.FC<IProps> = ({navigation}) => {
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

  const [bizCategoryList, setBizCategoryList] = useState<IDict[]>([]);
  useEffect(() => {
    const init = async () => {
      const bizList = (await getDictList('jour.bizCategory')) as IDict[];
      setBizCategoryList(bizList);
    };
    init();
  }, []);
  const [bizCategory, setBizCategory] = useState('');
  const canRefresh = useRef(true);
  const prevBizCategory = useRef('');
  const pickerRef = useRef<RNPickerSelect>();
  const [force, forceUpdate] = useReducer(x => x + 1, 0);
  const InputAccessoryView = useCallback(() => {
    return (
      <View style={styles.modal_view}>
        <TouchableWithoutFeedback
          onPress={() => {
            setBizCategory(prevBizCategory.current);
            pickerRef.current?.togglePicker(true);
          }}
          hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
          <View testID="needed_for_touchable">
            <Text style={styles.cancel}>取消</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.picker_title}>请选交易大类</Text>
        <TouchableWithoutFeedback
          onPress={() => {
            prevBizCategory.current = bizCategory;
            pickerRef.current?.togglePicker(true);
            canRefresh.current = true;
            forceUpdate();
          }}
          hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
          <View testID="needed_for_touchable">
            <Text style={[styles.cancel, styles.done]}>确定</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [bizCategory]);
  const onOpen = useCallback(() => {
    if (Platform.OS === 'ios') {
      canRefresh.current = false;
    }
  }, []);
  const onClose = useCallback(() => {
    if (prevBizCategory.current !== bizCategory) {
      setBizCategory(prevBizCategory.current);
    }
  }, [bizCategory]);
  const onValueChange = useCallback(value => {
    setBizCategory(value);
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.picker}>
          <RNPickerSelect
            ref={pickerRef as React.LegacyRef<RNPickerSelect>}
            placeholder={placeholder}
            value={bizCategory}
            onOpen={onOpen}
            onValueChange={onValueChange}
            onClose={onClose}
            style={pickerSelectStyles}
            InputAccessoryView={InputAccessoryView}
            items={bizCategoryList.map(item => ({
              label: item.value,
              value: item.key,
            }))}
            Icon={null}
          />
        </View>
      ),
    });
  }, [
    InputAccessoryView,
    bizCategory,
    bizCategoryList,
    navigation,
    onClose,
    onOpen,
    onValueChange,
  ]);
  useEffect(() => {
    if (!canRefresh.current) {
      return;
    }
    const task = InteractionManager.runAfterInteractions(() => {
      setRefreshing(true);
      jourMyPage({
        pageNum: 1,
        bizCategory,
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
    });
    return () => task.cancel();
  }, [bizCategory, force]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
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
  picker: {
    paddingHorizontal: 15,
  },
  picker_txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
    lineHeight: 23,
  },
  modal_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 49,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cancel: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    color: '#666666',
    lineHeight: 21,
  },
  done: {
    color: '#AB7007',
  },
  picker_title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 25,
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#F7F7F7',
  },
  empty: {
    paddingTop: 150,
  },
});

const pickerSelectStyles = StyleSheet.create({
  placeholder: {
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
  modalViewTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalViewBottom: {
    backgroundColor: '#fff',
  },
  inputIOS: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
  inputAndroid: {
    fontSize: 16,
    color: '#333',
  },
});

export default BillList;
