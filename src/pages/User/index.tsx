import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import useHeaderPaddingTopStyle from '@/utils/hooks/useHeaderPaddingTopStyle';
import {showHideMoney} from '@/utils/index';
import Avatar from '@/components/Avatar';
import Touchable from '@/components/Touchable';
import storage, {load} from '@/config/storage';
import {USER_WALLET_EYE} from '@/config/storageTypes';
import GlobalStyles from '@/assets/style/global';
import IconFont from '@/assets/iconfont';
import BgIcon from '@/assets/image/user/bg.png';
import QdsBgIcon from '@/assets/image/user/qds_bg.png';
import Level1Icon from '@/assets/image/user/level1.png';
import Level2Icon from '@/assets/image/user/level2.png';
import Level3Icon from '@/assets/image/user/level3.png';
import Level4Icon from '@/assets/image/user/level4.png';
import Level5Icon from '@/assets/image/user/level5.png';
import WalletBgIcon from '@/assets/image/user/wallet_bg.png';
import EyeIcon from '@/assets/image/user/eye.png';
import EyeCloseIcon from '@/assets/image/user/eye_close.png';
import WdsqIcon from '@/assets/image/user/wdsq.png';
import GdzhIcon from '@/assets/image/user/gdzh.png';
import TgzhIcon from '@/assets/image/user/tgzh.png';
import ClmbIcon from '@/assets/image/user/clmb.png';
import HotIcon from '@/assets/image/user/hot.png';
import NewIcon from '@/assets/image/user/new.png';
import YqhyIcon from '@/assets/image/user/yqhy.png';

interface IProps {
  navigation: RootStackNavigation;
}

const themeColor = '#D59420';

const selectUser = createSelector(
  (state: RootState) => state.user,
  user => user.user,
);

const User: React.FC<IProps> = ({navigation}) => {
  const userInfo = useSelector(selectUser);
  const dispatch = useDispatch();

  const padTopStyle = useHeaderPaddingTopStyle();

  const [isClose, setIsClose] = useState(false);
  useEffect(() => {
    load({
      key: USER_WALLET_EYE,
    }).then(data => {
      setIsClose(data === '1');
    });
    dispatch({
      type: 'user/getUserDetail',
    });
  }, [dispatch]);

  const handleEyeClick = useCallback(() => {
    setIsClose(!isClose);
    storage.save({
      key: USER_WALLET_EYE,
      data: !isClose ? '1' : '0',
    });
  }, [isClose]);
  const levelBg = useMemo(() => {
    switch (userInfo?.userGrade) {
      case '1':
        return Level1Icon;
      case '2':
        return Level2Icon;
      case '3':
        return Level3Icon;
      case '4':
        return Level4Icon;
      case '5':
        return Level5Icon;
      default:
        return Level1Icon;
    }
  }, [userInfo?.userGrade]);

  const goUserInfo = useCallback(() => {
    // navigation.navigate('UserInfo');
  }, [navigation]);
  const goAccount = useCallback(() => {
    navigation.navigate('Account');
  }, [navigation]);
  const goHelpCenter = useCallback(() => {
    navigation.navigate('HelpCenter');
  }, [navigation]);
  const goAboutUs = useCallback(() => {
    navigation.navigate('AboutUs');
  }, [navigation]);
  const goAccountSecurity = useCallback(() => {
    navigation.navigate('AccountSecurity');
  }, [navigation]);
  const goCommunity = useCallback(() => {
    navigation.navigate('Community', {
      isChannel: userInfo?.isChannel ?? '0',
    });
  }, [navigation, userInfo?.isChannel]);

  return (
    <ImageBackground source={BgIcon} style={styles.bg}>
      <ScrollView style={[styles.scroll, GlobalStyles.flex_1]}>
        {/* 昵称头像 */}
        <View style={[styles.top_box, padTopStyle]}>
          <View style={styles.top_left}>
            <Text style={styles.nickname}>{userInfo?.nickname}</Text>
            <View style={styles.level_box}>
              {userInfo?.isChannel === '1' ? (
                <ImageBackground source={QdsBgIcon} style={styles.level}>
                  <Text style={[styles.level_txt, styles.qds_level_txt]}>
                    {userInfo.nodeRate}%
                  </Text>
                </ImageBackground>
              ) : null}
              {userInfo?.rate ? (
                <ImageBackground source={levelBg} style={styles.level}>
                  <Text style={styles.level_txt}>{userInfo.rate}%</Text>
                </ImageBackground>
              ) : null}
            </View>
          </View>
          <View style={styles.top_right}>
            <Avatar uri={userInfo?.photo} style={styles.avatar} />
            <IconFont style={styles.edit_icon} name="icon-edit" size={24} />
          </View>
        </View>
        {/* 佣金钱包 */}
        <ImageBackground source={WalletBgIcon} style={styles.wallet_box}>
          <View style={GlobalStyles.flex_1}>
            <Touchable
              style={styles.wallet_title_box}
              onPress={handleEyeClick}
              ms={100}>
              <Text style={styles.wallet_title}>佣金钱包</Text>
              <Image
                style={styles.eye}
                source={isClose ? EyeCloseIcon : EyeIcon}
              />
            </Touchable>
            <Text style={[styles.amount]}>
              {showHideMoney(userInfo?.accountBalance, !isClose)}
              {!isClose ? <Text style={styles.unit}> USDT</Text> : null}
            </Text>
          </View>
          <Touchable style={styles.wallet_btn} onPress={goAccount}>
            <Text style={styles.wallet_btn_txt}>查看详情</Text>
          </Touchable>
        </ImageBackground>
        {/* 社群、跟单、托管、策略模版 */}
        <View style={styles.options}>
          <Touchable onPress={goCommunity} style={styles.option}>
            <Image source={WdsqIcon} style={styles.option_icon} />
            <Image source={HotIcon} style={styles.option_suffix_icon} />
            <Text style={styles.option_txt}>我的社群</Text>
          </Touchable>
          <Touchable style={styles.option}>
            <Image source={GdzhIcon} style={styles.option_icon} />
            <Text style={styles.option_txt}>跟单账户</Text>
          </Touchable>
          <Touchable style={styles.option}>
            <Image source={TgzhIcon} style={styles.option_icon} />
            <Text style={styles.option_txt}>托管账户</Text>
          </Touchable>
          <Touchable style={styles.option}>
            <Image source={ClmbIcon} style={styles.option_icon} />
            <Image source={NewIcon} style={styles.option_suffix_icon} />
            <Text style={styles.option_txt}>策略模板</Text>
          </Touchable>
        </View>
        {/* 邀请好友 */}
        <View style={styles.invite_box}>
          <Image style={styles.invite_icon} source={YqhyIcon} />
          <Text style={styles.invit_icon_txt}>邀</Text>
          <View style={GlobalStyles.flex_1}>
            <Text style={styles.invite_title}>邀请好友</Text>
            <Text style={styles.invite_tip}>邀请好友 玩转小圈子</Text>
          </View>
          <Touchable style={styles.invite_btn}>
            <Text style={styles.invite_btn_txt}>立即邀请</Text>
          </Touchable>
        </View>
        <Touchable onPress={goHelpCenter} style={styles.item}>
          <IconFont name="icon-help-center" size={22} />
          <Text style={styles.item_txt}>帮助中心</Text>
          <IconFont name="icon-right" size={12} color="#D4D4D4" />
        </Touchable>
        <Touchable onPress={goAboutUs} style={styles.item}>
          <IconFont name="icon-about-us" size={22} />
          <Text style={styles.item_txt}>关于我们</Text>
          <IconFont name="icon-right" size={12} color="#D4D4D4" />
        </Touchable>
        <Touchable onPress={goAccountSecurity} style={styles.item}>
          <IconFont name="icon-setting" size={22} />
          <Text style={styles.item_txt}>设置</Text>
          <IconFont name="icon-right" size={12} color="#D4D4D4" />
        </Touchable>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
  },
  scroll: {
    paddingHorizontal: 15,
  },
  top_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  top_left: {
    flex: 1,
  },
  nickname: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  level_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    width: 54,
    justifyContent: 'flex-end',
    paddingRight: 7,
    marginRight: 4,
  },
  level_txt: {
    ...Platform.select({
      android: {
        fontSize: 10,
      },
      ios: {
        fontSize: 12,
      },
    }),
    fontWeight: 'bold',
    fontFamily: 'DINAlternate-Bold',
    lineHeight: 16,
    color: '#fff',
  },
  qds_level_txt: {
    color: '#AD2E1D',
  },
  top_right: {
    position: 'relative',
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 65,
  },
  edit_icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 12,
  },
  wallet_box: {
    height: 89,
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 15.5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wallet_title_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wallet_title: {
    color: '#fff',
    marginRight: 3,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  eye: {
    width: 14,
    height: 14,
  },
  amount: {
    color: '#fff',
    fontSize: 25,
    lineHeight: 29,
    fontWeight: 'bold',
    fontFamily: 'DINAlternate-Bold',
    marginTop: 7,
  },
  unit: {
    fontSize: 12,
  },
  wallet_btn: {
    paddingHorizontal: 19,
    paddingVertical: 6,
    borderRadius: 17,
    backgroundColor: '#fff',
  },
  wallet_btn_txt: {
    color: themeColor,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 22.5,
    paddingBottom: 18,
  },
  option: {
    alignItems: 'center',
    position: 'relative',
  },
  option_icon: {
    width: 28,
    height: 28,
  },
  option_suffix_icon: {
    width: 23,
    height: 14,
    position: 'absolute',
    top: -7,
    right: -3,
  },
  option_txt: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
    marginTop: 3,
  },
  invite_box: {
    padding: 11,
    paddingRight: 15,
    paddingLeft: 5,
    backgroundColor: '#F8F8FB',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 7.5,
  },
  invite_icon: {
    width: 62,
    height: 36,
    flexShrink: 0,
  },
  invit_icon_txt: {
    position: 'absolute',
    left: 30,
    top: 25,
    width: 12,
    height: 12,
    backgroundColor: '#FFCB75',
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#FFBB3D',
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#F96D2F',
  },
  invite_title: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  invite_tip: {
    marginTop: 2,
    color: '#999999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  invite_btn: {
    backgroundColor: '#EFAB31',
    borderRadius: 16,
    paddingHorizontal: 13,
  },
  invite_btn_txt: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 25,
    fontFamily: 'PingFangSC-Regular',
  },
  item: {
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_txt: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B1B1B',
    lineHeight: 20,
    flex: 1,
    paddingLeft: 12,
  },
});

export default User;
