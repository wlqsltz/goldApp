import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ListRenderItemInfo,
  InteractionManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import Empty from '@/components/Empty';
import Touchable from '@/components/Touchable';
import GlobalStyles from '@/assets/style/global';
import Item from './components/Item';
import UnBindModal from './components/UnBindModal';
import {unbundlingApiKey} from '@/api/user';
import {toast} from '@/utils/index';
import UnBindFailedModal from './components/UnBindFailedModal';
import ChangeModal from './components/ChangeModal';
import { useFocusEffect } from '@react-navigation/native';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['user/getExchangeApiKey'],
);
const selectApiKeyList = createSelector(
  (state: RootState) => state.user,
  user => user.apiKeyList,
);
const selectApiKeyIndex = createSelector(
  (state: RootState) => state.user,
  user => user.apiKeyIndex,
);

const ApiAuthorization: React.FC<IProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const apiKeyList = useSelector(selectApiKeyList);
  const apiKeyIndex = useSelector(selectApiKeyIndex);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          dispatch({
            type: 'user/getExchangeApiKey',
            callback: () => {
              setHasMore(false);
            },
          });
        }, 0);
      });
      return () => task.cancel();
    }, [dispatch]),
  );

  const goChoseExchange = useCallback(() => {
    navigation.navigate('ChoseExchange');
  }, [navigation]);

  // 当前操作的api
  const [curApiKey, setCurApiKey] = useState<IApiKey>();

  // 解绑api
  const [unbindVisible, setUnbindVisible] = useState(false);
  const [unbindFailedVisible, setUnbindFailedVisible] = useState(false);
  // 左滑点击解绑按钮
  const onUnbindItemClick = useCallback((item: IApiKey) => {
    setCurApiKey(item);
    setTimeout(() => setUnbindVisible(true), 100);
  }, []);
  // 确认解绑
  const onUnbindConfirm = useCallback(async () => {
    if (!curApiKey) {
      toast('当前没有选中的API!');
      return;
    }
    const data = await unbundlingApiKey(curApiKey.id);
    if (data === '0') {
      // 当前有运行中的策略
      setUnbindFailedVisible(true);
    } else {
      dispatch({
        type: 'user/getExchangeApiKey',
      });
    }
  }, [curApiKey, dispatch]);

  // 切换api
  const [choseVisible, setChoseVisible] = useState(false);
  // 左滑点击解绑按钮
  const onChoseItemClick = useCallback((item: IApiKey) => {
    setCurApiKey(item);
    setTimeout(() => setChoseVisible(true), 100);
  }, []);
  // 确认切换
  const onChoseConfirm = useCallback(async () => {
    if (!curApiKey) {
      toast('当前没有选中的API!');
      return;
    }
    dispatch({
      type: 'user/changeApiKeyIndex',
    });
  }, [curApiKey, dispatch]);

  // 刷新
  const onRefresh = useCallback(() => {
    dispatch({
      type: 'user/getExchangeApiKey',
    });
  }, [dispatch]);

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<IApiKey>) => {
      return (
        <Item
          data={item}
          navigation={navigation}
          chosed={apiKeyIndex === index}
          onUnbind={onUnbindItemClick}
          onChose={onChoseItemClick}
        />
      );
    },
    [navigation, apiKeyIndex, onUnbindItemClick, onChoseItemClick],
  );
  const keyExtractor = useCallback((item: IApiKey) => item.id, []);
  const header = useMemo(
    () =>
      apiKeyList?.length ? (
        <Text style={styles.propmt_text}>您已成功绑定</Text>
      ) : null,
    [apiKeyList],
  );
  const empty = useMemo(
    () =>
      loading || hasMore ? null : (
        <Empty containerStyle={styles.empty} message="暂未绑定API" />
      ),
    [loading, hasMore],
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={GlobalStyles.flex_1}
        data={apiKeyList}
        extraData={apiKeyIndex}
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
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
      />
      <Touchable style={styles.bindingBtnWrap} onPress={goChoseExchange}>
        <View style={styles.bindingBtn}>
          <Text style={styles.bindingBtn_txt}>绑定API</Text>
        </View>
      </Touchable>
      <UnBindModal
        exchangeNo={curApiKey?.exchangeNo || ''}
        visible={unbindVisible}
        setVisible={setUnbindVisible}
        onConfirm={onUnbindConfirm}
      />
      <UnBindFailedModal
        visible={unbindFailedVisible}
        setVisible={setUnbindFailedVisible}
      />
      <ChangeModal
        exchangeNo={curApiKey?.exchangeNo || ''}
        visible={choseVisible}
        setVisible={setChoseVisible}
        onConfirm={onChoseConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  propmt_text: {
    marginTop: 25,
    height: 21,
    color: '#333',
    marginLeft: 15,
    lineHeight: 21,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  empty: {
    paddingTop: 150,
  },
  bindingBtnWrap: {
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#e6e6e6',
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: ifIphoneX(40, 20),
  },
  bindingBtn: {
    height: 50,
    backgroundColor: themeColor,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bindingBtn_txt: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  },
});

export default ApiAuthorization;
