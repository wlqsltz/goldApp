import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  InteractionManager,
  StatusBar,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import BgIcon from '@/assets/image/user/billDetail/bg.png';
import BoxBgIcon from '@/assets/image/user/billDetail/box-bg.png';
import {dateTimeFormat, SCREEN_WIDTH} from '@/utils/index';
import {RouteProp} from '@react-navigation/core';
import {RootStackParamList} from '@/navigator/';
import GlobalStyles from '@/assets/style/global';

const themeColor = '#D59420';
const boxWidth = SCREEN_WIDTH - 6;

interface IProps {
  route: RouteProp<RootStackParamList, 'BillDetail'>;
}

const BillDetail: React.FC<IProps> = ({route}) => {
  const {bill} = route.params;
  return (
    <View style={[GlobalStyles.flex_1, GlobalStyles.bg_fff]}>
      <StatusBar barStyle="light-content" />
      <Image source={BgIcon} style={styles.bg} />
      <ImageBackground source={BoxBgIcon} style={styles.box_bg}>
        <Text style={styles.box_title}>{bill.bizNote}</Text>
        <Text style={styles.box_amount}>
          {+bill.transAmount > 0 ? `+${bill.transAmount}` : bill.transAmount}{' '}
          {bill.currency}
        </Text>
      </ImageBackground>
      <ScrollView style={[GlobalStyles.flex_1, GlobalStyles.bg_fff]}>
        <View style={styles.log_box}>
          <View style={styles.log_b_single}>
            <Text style={styles.bs_txt}>变动前金额</Text>
            <Text style={styles.bs_tit}>
              {bill.preAmount} {bill.currency}
            </Text>
          </View>
          <View style={styles.log_b_single}>
            <Text style={styles.bs_txt}>变动后金额</Text>
            <Text style={styles.bs_tit}>
              {bill.postAmount} {bill.currency}
            </Text>
          </View>
          <View style={styles.log_b_single}>
            <Text style={styles.bs_txt}>变动时间</Text>
            <Text style={styles.bs_tit}>
              {dateTimeFormat(bill.createDatetime)}
            </Text>
          </View>
          <View style={styles.log_b_single}>
            <Text style={styles.bs_txt}>明细摘要</Text>
            <Text style={styles.bs_tit}>{bill.remark}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: SCREEN_WIDTH,
    height: 130 + getStatusBarHeight(),
  },
  box_bg: {
    width: boxWidth,
    height: 114,
    marginTop: -54,
    marginLeft: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box_title: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
  box_amount: {
    marginTop: 2,
    color: '#333333',
    fontSize: 22,
    lineHeight: 31,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Medium',
  },
  log_box: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  log_b_single: {
    flexDirection: 'row',
    minHeight: 50,
    paddingVertical: 15,
    borderColor: '#E3E3E3',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bs_txt: {
    width: 96,
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
  bs_tit: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
});

export default BillDetail;
