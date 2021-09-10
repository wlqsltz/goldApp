import React, {useCallback} from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import CbIcon from '@/assets/image/user/account/cb.png';
import TbIcon from '@/assets/image/user/account/tb.png';
import Touchable from '@/components/Touchable';
import GlobalStyles from '@/assets/style/global';
import {dateFormat} from '@/utils/index';
import {RootStackNavigation} from '@/navigator/index';

interface IProps {
  data: IBill;
}

const Item: React.FC<IProps> = React.memo(({data}) => {
  const navigation = useNavigation<RootStackNavigation>();
  const goBillDetail = useCallback(() => {
    navigation.navigate('BillDetail', {
      bill: data,
    });
  }, [data, navigation]);
  return (
    <Touchable
      onPress={goBillDetail}
      style={[GlobalStyles.flex_row, styles.container]}>
      <Image
        style={styles.image}
        source={+data.transAmount > 0 ? CbIcon : TbIcon}
      />
      <View style={styles.summary}>
        <View style={[GlobalStyles.flex_row, styles.summary_top]}>
          <Text style={styles.bit_note}>{data.bizNote}</Text>
          <Text
            style={[
              styles.trans_amount,
              +data.transAmount >= 0 ? styles.green : styles.red,
            ]}>
            {+data.transAmount > 0 ? `+${data.transAmount}` : data.transAmount}
          </Text>
        </View>
        <Text style={styles.date}>
          {dateFormat(data.createDatetime, 'MM-DD hh:mm')}
        </Text>
        <Text style={styles.remark}>{data.remark}</Text>
      </View>
    </Touchable>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
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
  image: {
    width: 30,
    height: 30,
  },
  summary: {
    marginLeft: 15,
    flex: 1,
  },
  summary_top: {
    justifyContent: 'space-between',
  },
  bit_note: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Medium',
  },
  trans_amount: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  green: {
    color: '#28BE67',
  },
  red: {
    color: '#DB5959',
  },
  date: {
    color: '#999999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 5,
  },
  remark: {
    color: '#999999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: '500',
  },
});

export default Item;
