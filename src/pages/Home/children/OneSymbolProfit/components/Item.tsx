import React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import IconFont from '@/assets/iconfont';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';

interface IProps {
  data: IPairDayIncome;
}

const Item: React.FC<IProps> = ({data}) => {
  return (
    <Touchable style={styles.bl_single}>
      <View style={styles.ls_top}>
        <View style={GlobalStyles.flex_row}>
          <Text style={styles.ls_l_bt}>{data.symbol}</Text>
          <Text style={styles.ls_l_txt}>/{data.toSymbol}</Text>
          <View style={styles.ls_l_tag}>
            <Text style={styles.tag_txt}>{data.exchangeName}</Text>
          </View>
        </View>
        <View style={styles.ls_b_r}>
          <Text style={styles.lr_txt}>查看详情</Text>
          <IconFont name="icon-right" color="#999999" size={12} />
        </View>
      </View>
      <View style={styles.ls_box}>
        <View style={styles.ls_l_li}>
          <Text style={styles.l_li_ht}>今日盈利</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.l_li_bt,
              +data.todayIncome < 0 ? styles.l_li_bt_r : styles.l_li_bt_g,
            ]}>
            {+data.todayIncome > 0 ? `+${data.todayIncome}` : data.todayIncome}
          </Text>
        </View>
        <View style={styles.ls_l_li}>
          <Text style={styles.l_li_ht}>累计盈利</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.l_li_bt,
              +data.totalIncome < 0 ? styles.l_li_bt_r : styles.l_li_bt_g,
            ]}>
            {+data.totalIncome > 0 ? `+${data.totalIncome}` : data.totalIncome}
          </Text>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  bl_single: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 12,
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
  ls_top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  ls_l_bt: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: 'HelveticaNeue-Medium',
  },
  ls_l_txt: {
    color: '#CACDD1',
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'ArialMT',
    marginLeft: 2,
    marginTop: 2,
  },
  ls_l_tag: {
    backgroundColor: '#D59420',
    borderRadius: 2,
    marginLeft: 2,
    paddingHorizontal: 2,
  },
  tag_txt: {
    color: '#FFFFFF',
    fontSize: 9,
    lineHeight: 12,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  ls_r_txt: {
    color: '#C4C4C4',
    fontSize: 12,
    lineHeight: 13,
    fontFamily: 'PingFangSC-Regular',
  },
  ls_box: {},
  ls_l_li: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  l_li_ht: {
    color: '#A8ACBB',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    marginRight: 3,
  },
  l_li_bt: {
    color: '#333',
    fontSize: 19,
    lineHeight: 23,
    fontWeight: 'bold',
    fontFamily: 'DINAlternate-Bold',
  },
  l_li_bt_r: {
    color: '#E15151',
  },
  l_li_bt_g: {
    color: '#2BAD6F',
  },
  ls_b_r: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 3,
  },
  lr_txt: {
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    marginRight: 2,
  },
});

export default Item;
