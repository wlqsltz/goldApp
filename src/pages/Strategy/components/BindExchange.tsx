import React, {useCallback} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {themeColor} from '@/utils/index';
import HbApiIcon from '@/assets/image/strategy/hb-api.png';
import BaApiIcon from '@/assets/image/strategy/ba-api.png';
import Touchable from '@/components/Touchable';
import {RootStackNavigation} from '@/navigator/index';

const exchangeObj: any = {
  '1': {name: '火币', apiKey: 'Access Key', icon: HbApiIcon},
  '2': {name: '币安', apiKey: 'API Key', icon: BaApiIcon},
};

interface IProps {
  exchangeNo: string;
}
const BindExchange: React.FC<IProps> = ({exchangeNo = '1'}) => {
  const navigation = useNavigation<RootStackNavigation>();
  const goBindApi = useCallback(() => {
    navigation.navigate('BindApi', {
      exchangeNo,
    });
  }, [exchangeNo, navigation]);

  return (
    <View style={styles.bex_con}>
      <View style={styles.bex_icon_box}>
        <Image style={styles.bex_icon} source={exchangeObj[exchangeNo]?.icon} />
      </View>
      <Text style={styles.bex_tit}>
        您还未绑定{exchangeObj[exchangeNo]?.name}API，请先绑定
      </Text>
      <View style={styles.bex_foo}>
        <Text style={styles.bex_tip}>
          您的{exchangeObj[exchangeNo]?.apiKey}
          ，我们仅用于以下场景，不涉及划转/提币等敏感操作
        </Text>
        <Text style={styles.bt_txt}>1.实施策略交易</Text>
        <Text style={styles.bt_txt}>2.同步持仓和交易数据</Text>
      </View>
      <Touchable onPress={goBindApi} style={styles.bf_btn}>
        <Text style={styles.btn_txt}>
          绑定{exchangeObj[exchangeNo]?.name}API
        </Text>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  bex_head: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bex_h_li: {
    width: 81,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  h_li_active: {
    backgroundColor: '#FFFFFF',
  },
  hli_txt: {
    color: '#B3B6B5',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  hli_txt_active: {
    color: '#333333',
    fontSize: 17,
    lineHeight: 24,
  },
  bex_con: {
    backgroundColor: '#FFFFFF',
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  bex_icon_box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bex_icon: {
    width: 160,
    height: 120,
  },
  bex_tit: {
    color: '#333333',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
    marginTop: 15,
    marginBottom: 15,
  },
  bex_foo: {
    borderTopWidth: 0.5,
    borderColor: '#E4E4E4',
    paddingTop: 15,
  },
  bex_tip: {
    color: themeColor,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 9,
  },
  bt_txt: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 23,
    fontFamily: 'PingFangSC-Regular',
  },
  bf_btn: {
    backgroundColor: themeColor,
    borderRadius: 4,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  btn_txt: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 23,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
});

export default BindExchange;
