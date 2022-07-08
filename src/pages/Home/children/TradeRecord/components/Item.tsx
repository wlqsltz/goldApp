import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {RootStackNavigation} from '@/navigator/index';
import IconFont from '@/assets/iconfont';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {dateTimeFormat} from '@/utils/index';

interface IProps {
  data: ITradeRecord;
}

const cjList = ['2', '3', '5'];
// const enstrustStatusObj: any = {
//   '0': '待成交',
//   '1': '部分成交',
//   '2': '已撤销',
//   '3': '完全成交',
//   '4': '已撤销',
// };

const Item: React.FC<IProps> = ({data}) => {
  const navigation = useNavigation<RootStackNavigation>();

  const goTradeRecordDetail = useCallback(() => {
    navigation.navigate('TradeRecordDetail', {
      id: data.id,
    });
  }, [data.id, navigation]);

  return (
    <Touchable
      style={[styles.rz_single, GlobalStyles.bg_fff]}
      onPress={goTradeRecordDetail}>
      <View style={styles.rz_s_top}>
        <Text style={styles.st_tit}>{data.actionTypeName}</Text>
        <Text style={styles.st_txt}>{dateTimeFormat(data.createDatetime)}</Text>
      </View>
      <View style={styles.rz_s_foo}>
        <View style={styles.sf_left}>
          <View style={styles.sf_l_li}>
            <Text style={styles.fli_tit}>
              {cjList.includes(data.actionType) ? '成交金额' : '委托金额'} (
              {data.toSymbol})
            </Text>
            <Text style={styles.fli_bt} numberOfLines={1}>
              {cjList.includes(data.actionType)
                ? data.tradedAmount
                : data.totalAmount}
            </Text>
          </View>
          {data.enstrustStatus !== '2' && data.enstrustStatus !== '4' ? (
            <>
              <View style={styles.sf_l_li}>
                <Text style={styles.fli_tit}>成交均价 ({data.toSymbol})</Text>
                <Text style={styles.fli_bt} numberOfLines={1}>
                  {data.avgPrice || '-'}
                </Text>
              </View>
              <View style={styles.sf_l_li}>
                <Text style={styles.fli_tit}>成交数量 ({data.symbol})</Text>
                <Text style={styles.fli_bt} numberOfLines={1}>
                  {data.tradedCount || '-'}
                </Text>
              </View>
            </>
          ) : null}
        </View>
        <View style={styles.f_box}>
          <Text style={styles.f_txt}>查看详情</Text>
          <IconFont name="icon-right" color="#999" size={12} />
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  rz_single: {
    marginBottom: 15,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 15,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  rz_s_top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  st_tit: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  st_txt: {
    color: '#C4C4C4',
    fontSize: 12,
    lineHeight: 13,
    fontFamily: 'PingFangSC-Regular',
  },
  st_kq: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  rz_s_foo: {
    justifyContent: 'space-between',
  },
  sf_left: {
    marginBottom: 7,
  },
  sf_l_li: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
    justifyContent: 'space-between',
    height: 18,
  },
  fli_tit: {
    color: '#A8ACBB',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  fli_bt: {
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    marginRight: 2,
  },
  fli_tt: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'PingFangSC-Regular',
  },
  fli_txt: {
    color: '#333333',
    fontSize: 9,
    lineHeight: 11,
    fontFamily: 'PingFangSC-Regular',
  },
  f_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  f_txt: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'PingFangSC-Regular',
  },
});

export default Item;
