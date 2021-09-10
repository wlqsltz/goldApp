import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {dateTimeFormat} from '@/utils/index';

interface IProps {
  data: IBill;
}
const Item: React.FC<IProps> = ({data}) => {
  const {transAmount, createDatetime, remark} = data;
  return (
    <View style={styles.container}>
      <View style={styles.cs_top}>
        <Text style={styles.cs_t_l}>
          {+transAmount > 0 ? `+${transAmount}` : transAmount}
          <Text style={styles.cs_t_l_t}> USDT</Text>
        </Text>
        <Text style={styles.ct_t_r}>
          {dateTimeFormat(createDatetime, 'YYYY-MM-DD hh:mm')}
        </Text>
      </View>
      <Text style={styles.ct_t_r}>{remark}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingTop: 11,
    paddingBottom: 16,
    paddingHorizontal: 15,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  cs_top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  cs_t_l: {
    color: '#28BE67',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
  cs_t_l_t: {
    fontSize: 10,
  },
  ct_t_r: {
    color: '#999999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
  },
});

export default Item;
