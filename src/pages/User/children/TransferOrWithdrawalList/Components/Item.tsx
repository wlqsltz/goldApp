import React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import {dateTimeFormat} from '@/utils/index';
import GlobalStyles from '@/assets/style/global';

interface IProps {
  data: ITransfer;
  type: string;
  statusObj: Record<string, string>;
}
const Item: React.FC<IProps> = ({data, type, statusObj}) => {
  const {amount, currency, applyDatetime, fee, status, toAddress, toUser} =
    data;
  const remark = type === '1' ? `提到: ${toAddress}` : `转给: ${toUser.mobile}`;
  const statusName = statusObj[status];
  return (
    <View style={styles.c_single}>
      <View style={styles.cs_top}>
        <View style={styles.ct_left}>
          <Text style={styles.cs_t_l}>
            - {amount}
            <Text style={GlobalStyles.f10}> {currency}</Text>
          </Text>
          <Text style={styles.ct_fee}>手续费：{fee}</Text>
        </View>
        <Text
          style={[
            styles.ct_t_r,
            type === '1'
              ? status === '1' && styles.ct_t_r_active
              : status === '0' && styles.ct_t_r_active,
          ]}>
          {statusName}
        </Text>
      </View>
      <View style={styles.ct_foo}>
        <Text style={[styles.ct_f_txt, styles.ct_f_txt_l]} numberOfLines={1}>
          {remark}
        </Text>
        <Text style={styles.ct_f_txt}>
          {dateTimeFormat(applyDatetime, 'YYYY-MM-DD hh:mm')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  c_single: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingTop: 11,
    paddingBottom: 15,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
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
  cs_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ct_left: {},
  ct_fee: {
    marginTop: 2,
    color: '#D59420',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  cs_t_l: {
    color: '#DB5959',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
  ct_t_r: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  ct_t_r_active: {
    color: '#D59420',
  },
  ct_foo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ct_f_txt: {
    color: '#999999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  ct_f_txt_l: {
    marginRight: 10,
    flex: 1,
  },
});

export default Item;
