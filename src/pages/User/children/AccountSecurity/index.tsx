import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Switch,
  InteractionManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';
import Touchable from '@/components/Touchable';
import IconFont from '@/assets/iconfont';
import {RootState} from '@/models/index';
import {SCREEN_WIDTH, starMobile} from '@/utils/index';
import {load} from '@/config/storage';
import {GESTURES_PWD} from '@/config/storageTypes';
import {useFocusEffect} from '@react-navigation/core';

interface IProps {
  navigation: RootStackNavigation;
}

const themeColor = '#D59420';

const selectUser = createSelector(
  (state: RootState) => state.user,
  user => user.user,
);

const AccountSecurity: React.FC<IProps> = ({navigation}) => {
  const userInfo = useSelector(selectUser);
  const dispatch = useDispatch();

  const goEditMobile = useCallback(() => {
    navigation.navigate('EditMobile', {
      mobile: userInfo?.mobile,
    });
  }, [navigation, userInfo?.mobile]);
  const goEditLoginPwd = useCallback(() => {
    navigation.navigate('EditLoginPwd', {
      mobile: userInfo?.mobile,
    });
  }, [navigation, userInfo?.mobile]);
  const goEditTradePwd = useCallback(() => {
    navigation.navigate('EditTradePwd', {
      mobile: userInfo?.mobile,
      pwdFlag: userInfo?.tradePwdFlag === '1',
    });
  }, [navigation, userInfo?.mobile, userInfo?.tradePwdFlag]);

  const [isEnabled, setIsEnabled] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        load({
          key: GESTURES_PWD,
        }).then(data => {
          setIsEnabled(!!data);
        });
      });

      return () => task.cancel();
    }, []),
  );
  // 手势密码切换
  const toggleSwitch = useCallback(async () => {
    // await removeMsg('pwdOrigin');
    // NavigatorUtil.goPage('GesturesPassword', {
    //   isEnabled: (+isEnabled).toString(),
    // });
  }, []);

  // 退出登录
  const logout = useCallback(async () => {
    dispatch({
      type: 'user/logout',
    });
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Touchable onPress={goEditMobile} style={styles.item}>
          <View style={styles.inner_item}>
            <Text style={styles.item_title}>
              {userInfo?.mobile ? '修改手机号' : '绑定手机号'}
            </Text>
            <View style={styles.suffix_box}>
              <Text style={styles.suffix_tip}>
                {starMobile(userInfo?.mobile)}
              </Text>
              <IconFont name="icon-right" size={13} color="#949AA5" />
            </View>
          </View>
        </Touchable>
        <Touchable onPress={goEditLoginPwd} style={styles.item}>
          <View style={styles.inner_item}>
            <Text style={styles.item_title}>修改登录密码</Text>
            <View style={styles.suffix_box}>
              <IconFont name="icon-right" size={13} color="#949AA5" />
            </View>
          </View>
        </Touchable>
        <Touchable onPress={goEditTradePwd} style={styles.item}>
          <View style={styles.inner_item}>
            <Text style={styles.item_title}>
              {userInfo?.tradePwdFlag === '1' ? '修改' : '设置'}
              交易密码
            </Text>
            <View style={styles.suffix_box}>
              <IconFont name="icon-right" size={13} color="#949AA5" />
            </View>
          </View>
        </Touchable>
        <View style={styles.bar} />
        <Touchable style={styles.item}>
          <View style={styles.inner_item}>
            <Text style={styles.item_title}>手势密码</Text>
            <View style={styles.suffix_box}>
              <Switch
                trackColor={{
                  false: '#e6e6e6',
                  true: themeColor,
                }}
                thumbColor={isEnabled ? '#fff' : '#e6e6e6'}
                ios_backgroundColor="#e6e6e6"
                onValueChange={() => setIsEnabled(val => !val)}
                value={isEnabled}
              />
            </View>
          </View>
        </Touchable>
      </ScrollView>
      <Touchable style={styles.btn} onPress={logout}>
        <Text style={styles.btn_txt}>退出登录</Text>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
    paddingTop: 4,
  },
  item: {
    paddingHorizontal: 15,
  },
  inner_item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 17,
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  item_title: {
    flex: 1,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 23,
  },
  suffix_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suffix_tip: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#999',
    lineHeight: 23,
    marginRight: 9,
  },
  bar: {
    height: 10,
    backgroundColor: '#F0F0F0',
    opacity: 0.85,
  },
  btn: {
    width: SCREEN_WIDTH - 30,
    marginLeft: 15,
    marginBottom: ifIphoneX(75, 50),
    height: 50,
    borderRadius: 4,
    borderColor: themeColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_txt: {
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    fontSize: 18,
    color: themeColor,
    lineHeight: 23,
  },
  bindingBtnWrap: {
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#e6e6e6',
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: ifIphoneX(40, 20),
  },
});

export default AccountSecurity;
