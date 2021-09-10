import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import {RouteProp} from '@react-navigation/core';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {xaddressChargeAddress} from '@/api/trade';
import IconFont from '@/assets/iconfont';
import BoxIcon from '@/assets/image/user/charge/box.png';
import {copyText, SCREEN_WIDTH} from '@/utils/index';
import QRCode from 'react-native-qrcode-svg';

interface IChainAddress {
  address: string;
  chainTag: string;
  symbol: string;
  type: string;
}

interface IEntity {
  accountNumber: string;
  chainAddressList: IChainAddress[];
  chainList: string[];
}

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'Charge'>;
}

const themeColor = '#D59420';
const boxWidth = SCREEN_WIDTH - 105;

const Charge: React.FC<IProps> = ({navigation, route}) => {
  const [tip, setTip] = useState(true);
  const hideTip = useCallback(() => {
    setTip(false);
  }, []);

  const {accountNumber} = route.params;
  const [selectChain, setSelectChain] = useState('');
  const [chainDetail, setChainDetail] = useState<IEntity>();
  const address = useMemo(() => {
    const list = Array.isArray(chainDetail?.chainAddressList)
      ? (chainDetail as IEntity).chainAddressList.filter(
          (it: any) => it.chainTag === selectChain,
        )
      : [];
    return list.length ? list[0].address : '';
  }, [chainDetail, selectChain]);

  const copy = useCallback(async () => {
    copyText(address);
  }, [address]);

  const getXaddressChargeAddress = useCallback(() => {
    xaddressChargeAddress(accountNumber).then((d: any) => {
      console.log(d);
      setChainDetail(d);
      setSelectChain(d.chainList?.[0] ?? '');
    });
  }, [accountNumber]);
  useEffect(() => {
    getXaddressChargeAddress();
  }, [getXaddressChargeAddress]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable
          style={styles.head_right}
          onPress={() => navigation.navigate('ChargeList')}>
          <Text style={styles.head_right_txt}>记录</Text>
        </Touchable>
      ),
    });
  }, [navigation]);

  return (
    <View style={[GlobalStyles.flex_1, GlobalStyles.bg_fff]}>
      <StatusBar barStyle="dark-content" />
      <View style={GlobalStyles.flex_1}>
        {tip ? (
          <View style={styles.out_page_head}>
            <Text style={styles.out_head_l}>
              USDT钱包地址禁止充值除USDT之外额其他资产，任何USDT
              资产充值将不可找回
            </Text>
            <Touchable onPress={hideTip}>
              <IconFont
                name="icon-guanbi"
                size={14}
                color="rgba(245, 146, 24, 0.85)"
              />
            </Touchable>
          </View>
        ) : null}
        <View style={styles.l_type}>
          <Text style={styles.lt_left}>链类型</Text>
          <View style={styles.lt_right}>
            {chainDetail?.chainList.map(item => (
              <Touchable
                key={item}
                ms={100}
                onPress={() => setSelectChain(item)}
                style={[
                  styles.lt_single,
                  selectChain === item && styles.lt_single_active,
                ]}>
                <Text
                  style={[
                    styles.lt_s_txt,
                    selectChain === item && styles.lt_s_txt_active,
                  ]}>
                  {item}
                </Text>
              </Touchable>
            ))}
          </View>
        </View>
        <ImageBackground style={styles.out_con} source={BoxIcon}>
          <View style={styles.out_con_box}>
            {address ? (
              <QRCode
                value={address}
                logoBorderRadius={0}
                color={'#191919'}
                backgroundColor={'#ffffff'}
                logoSize={0}
                size={boxWidth - 80}
              />
            ) : null}
          </View>
        </ImageBackground>
        <View style={styles.address_txt_box}>
          <Text style={styles.out_address_txt}>充币地址</Text>
        </View>
        {address ? (
          <View style={styles.out_address_box}>
            <Text style={styles.out_address}>{address}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cb_foo}>
        <Touchable onPress={copy} style={styles.foo_box}>
          <Text style={styles.foo_box_txt}>复制地址</Text>
        </Touchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head_right: {
    paddingHorizontal: 15,
  },
  head_right_txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
  },
  out_page_head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: 'rgba(255,246,235,0.85)',
  },
  out_head_l: {
    flex: 1,
    marginRight: 6,
    color: '#F59218',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  l_type: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  lt_left: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
    marginRight: 26,
  },
  lt_right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lt_single: {
    borderColor: '#B7B7B7',
    borderWidth: 0.5,
    borderRadius: 3,
    width: 74,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  lt_single_active: {
    borderColor: themeColor,
    backgroundColor: '#FBF2E1',
  },
  lt_s_txt: {
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#999999',
  },
  lt_s_txt_active: {
    color: themeColor,
  },
  out_con: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: boxWidth,
    height: boxWidth,
    marginBottom: 35,
    marginLeft: 53,
  },
  out_con_box: {
    width: boxWidth - 50,
    height: boxWidth - 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(149, 61, 43, 0.16)',
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  address_txt_box: {
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  out_address_txt: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'PingFangSC-Regular',
  },
  out_address_box: {
    marginHorizontal: 15,
    height: 40,
    backgroundColor: 'rgba(255, 253, 253, 0.85)',
    justifyContent: 'center',
    paddingLeft: 11,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(140, 43, 43, 0.15)',
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  out_address: {
    color: '#666666',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Medium',
  },
  cb_foo: {
    backgroundColor: '#fff',
    borderColor: '#DFDFDF',
    borderTopWidth: 1,
    paddingLeft: 15,
    paddingTop: 8,
    paddingHorizontal: 15,
    paddingBottom: ifIphoneX(28, 8),
  },
  foo_box: {
    backgroundColor: themeColor,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foo_box_txt: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Medium',
  },
});

export default Charge;
