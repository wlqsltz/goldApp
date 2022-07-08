import React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import IconFont from '@/assets/iconfont';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {dateTimeFormat} from '@/utils/index';

interface IProps {
  data: IXStrategyHistory;
}
const Item: React.FC<IProps> = ({data}) => {
  return (
    <Touchable style={styles.pro_li}>
      <View style={styles.p_li_top}>
        <View style={GlobalStyles.flex_row}>
          <Text style={styles.ls_l_bt}>{data.symbol}</Text>
          <Text style={styles.ls_l_txt}>/{data.toSymbol}</Text>
          <View style={styles.ls_l_tag}>
            <Text style={styles.tag_txt}>{data.exchangeName}</Text>
          </View>
        </View>
        <Text style={styles.li_t_t}>{dateTimeFormat(data.createTime)}</Text>
      </View>
      <View style={styles.p_li_foo}>
        <View style={styles.p_li_l}>
          <View style={[styles.li_l_s]}>
            <Text style={styles.p_li_zt}>持仓金额</Text>
            <Text style={styles.p_li_rq}>{data.entrustAmount}</Text>
          </View>
          <View style={styles.li_l_s}>
            <Text style={styles.p_li_zt}>实现盈利</Text>
            <Text
              style={[
                styles.p_li_ml,
                +data.plAmount < 0
                  ? GlobalStyles.down_color
                  : GlobalStyles.up_color,
              ]}
              numberOfLines={1}>
              {+data.plAmount > 0 ? `+${data.plAmount}` : data.plAmount}
            </Text>
          </View>
        </View>
        <View style={[GlobalStyles.flex_row, GlobalStyles.flex_jc_end]}>
          <Text style={styles.detail}>查看详情</Text>
          <IconFont name="icon-right" color="#999999" size={12} />
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  pro_li: {
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingTop: 12,
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
  p_li_top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  li_t_t: {
    color: '#C4C4C4',
    fontSize: 12,
    lineHeight: 13,
    fontFamily: 'PingFangSC-Regular',
  },
  p_li_foo: {},
  p_li_l: {
    marginBottom: 6,
  },
  li_l_s: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  p_li_rq: {
    color: '#333',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  p_li_zt: {
    color: '#A8ACBB',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    marginRight: 3,
  },
  p_li_ml: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  detail: {
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    marginRight: 2,
  },
});

export default Item;
