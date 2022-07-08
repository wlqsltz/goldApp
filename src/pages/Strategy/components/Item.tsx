import React, {useCallback, useMemo} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {RootStackNavigation} from '@/navigator/index';
import {IXstrategy} from '@/models/strategy';
import CheckIcon from '@/assets/image/strategy/check.png';
import CheckOnIcon from '@/assets/image/strategy/check-on.png';
import EditIcon from '@/assets/image/strategy/edit.png';
import IconFont from '@/assets/iconfont';

const themeColor = '#D59420';

const statusMap = {
  '0': '待开启',
  '1': '正常运行中',
  '20': '正常终止',
  '21': '手动终止',
  '22': '佣金欠费终止',
  '23': '仓位缺失终止',
} as Record<string, string>;

interface IProps {
  data: IXstrategy;
  chosed: boolean;
  toggleItem: (id: string) => void;
  goSetting: (item: IXstrategy) => void;
}

const Item: React.FC<IProps> = ({data, chosed, toggleItem, goSetting}) => {
  const navigation = useNavigation<RootStackNavigation>();

  const showEdit = useMemo(() => {
    const stopPrice = Number(data.stopPrice);
    const stopRate = Number(data.stopRate);
    if (stopPrice > 0 || stopRate > 0) {
      return false;
    }
    return true;
  }, [data.stopPrice, data.stopRate]);

  const handleToggleItem = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      toggleItem(data.id);
    },
    [data.id, toggleItem],
  );
  const handleSetting = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      goSetting(data);
    },
    [data, goSetting],
  );

  return (
    <Touchable style={[GlobalStyles.bg_fff, GlobalStyles.ph15]}>
      <View style={styles.container}>
        <View style={[GlobalStyles.flex_row, GlobalStyles.flex_jc_sb]}>
          <Touchable
            onPress={handleToggleItem}
            ms={100}
            style={GlobalStyles.flex_row}>
            <Image
              style={styles.check_icon}
              source={chosed ? CheckOnIcon : CheckIcon}
            />
            <View style={styles.symbol_box}>
              <Text style={styles.symbol}>{data.symbol}</Text>
              <Text style={styles.to_symbol}>/{data.toSymbol}</Text>
            </View>
            <View
              style={[
                styles.type_box,
                data.type === '1' && styles.type_box_circle,
              ]}>
              <Text
                style={[styles.type, data.type === '1' && styles.type_circle]}>
                {data.type === '1' ? '循环策略' : '单次策略'}
              </Text>
            </View>
          </Touchable>
          <View style={GlobalStyles.flex_row}>
            <IconFont
              name={+data.status > 10 ? 'icon-tip-square' : 'icon-yunxing'}
              size={12}
            />
            <Text style={styles.status}>{statusMap[data.status]}</Text>
            <IconFont name="icon-right" size={10} color="#999999" />
          </View>
        </View>
        <View
          style={[
            GlobalStyles.flex_row,
            GlobalStyles.flex_jc_sb,
            GlobalStyles.mt9,
          ]}>
          <View style={GlobalStyles.flex_row}>
            <Text style={styles.pl_amount}>盈亏</Text>
            <Text style={[styles.pl_amount, GlobalStyles.ml2]}>(USDT)</Text>
          </View>
          <Text style={styles.pl_amount}>盈亏率</Text>
        </View>
        <View
          style={[
            GlobalStyles.flex_row,
            GlobalStyles.flex_jc_sb,
            GlobalStyles.mt4,
          ]}>
          <Text
            style={[
              styles.pl_amount_txt,
              +data.plAmount >= 0
                ? GlobalStyles.up_color
                : GlobalStyles.down_color,
            ]}>
            {+data.plAmount > 0 ? `+${data.plAmount}` : data.plAmount}
          </Text>
          <Text
            style={[
              styles.pl_amount_txt,
              +data.plAmountRate >= 0
                ? GlobalStyles.up_color
                : GlobalStyles.down_color,
            ]}>
            {+data.plAmountRate > 0
              ? `+${data.plAmountRate}`
              : data.plAmountRate}
            %
          </Text>
        </View>
        <View
          style={[
            GlobalStyles.flex_row,
            GlobalStyles.flex_jc_sb,
            GlobalStyles.mt3,
          ]}>
          <View style={GlobalStyles.mt12}>
            <View style={GlobalStyles.flex_row}>
              <Text style={styles.title}>持仓金额</Text>
              <Text style={[styles.title, GlobalStyles.ml2]}>(USDT)</Text>
            </View>
            <Text style={[styles.value, GlobalStyles.mt3]}>
              {+data.entrustAmount === 0 ? '0.0000' : data.entrustAmount}
            </Text>
            <View style={[GlobalStyles.flex_row, GlobalStyles.mt12]}>
              <Text style={styles.title}>补仓次数</Text>
              <Text style={[styles.title, GlobalStyles.ml2]}>(USDT)</Text>
            </View>
            <Text style={[styles.value, GlobalStyles.mt3]}>
              {data.btNowCount ?? '--'}
              {data.manualCount && +data.manualCount > 0
                ? `+${data.manualCount}`
                : ''}
            </Text>
          </View>
          <View style={GlobalStyles.mt12}>
            <View style={GlobalStyles.flex_row}>
              <Text style={styles.title}>持仓数量</Text>
              <Text style={[styles.title, GlobalStyles.ml2]}>(USDT)</Text>
            </View>
            <Text style={[styles.value, GlobalStyles.mt3]}>
              {+data.positionCount === 0 ? '0.0000' : data.positionCount}
            </Text>
            <View style={[GlobalStyles.flex_row, GlobalStyles.mt12]}>
              <Text style={styles.title}>最新价</Text>
              <Text style={[styles.title, GlobalStyles.ml2]}>(USDT)</Text>
            </View>
            <Text style={[styles.value, GlobalStyles.mt3]}>
              {data.lastPrice}
            </Text>
          </View>
          <View style={[GlobalStyles.mt12, GlobalStyles.flex_ai_end]}>
            <View style={GlobalStyles.flex_row}>
              <Text style={styles.title}>持仓均价</Text>
              <Text style={[styles.title, GlobalStyles.ml2]}>(USDT)</Text>
            </View>
            <Text style={[styles.value, GlobalStyles.mt3]}>
              {+data.positionPrice === 0 ? '0.0000' : data.positionPrice}
            </Text>
            <View style={[GlobalStyles.flex_row, GlobalStyles.mt12]}>
              <Text style={styles.title}>止损价</Text>
              <Text style={[styles.title, GlobalStyles.ml2]}>(USDT)</Text>
            </View>
            <Touchable
              onPress={handleSetting}
              style={[GlobalStyles.flex_row, GlobalStyles.mt3]}>
              {!showEdit ? (
                <Text style={[styles.value, styles.edit_value]}>
                  {+data.positionPrice === 0 ? '0.0000' : data.positionPrice}
                </Text>
              ) : (
                <Text style={styles.edit}>去设置</Text>
              )}
              <Image style={styles.edit_icon} source={EditIcon} />
            </Touchable>
          </View>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  check_icon: {
    width: 15,
    height: 15,
  },
  symbol_box: {
    marginHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  symbol: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 20,
  },
  to_symbol: {
    paddingLeft: 2,
    fontFamily: 'ArialMT',
    fontSize: 12,
    color: '#CACDD1',
    lineHeight: 14,
  },
  type_box: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    backgroundColor: '#F4E9D6',
  },
  type_box_circle: {
    backgroundColor: themeColor,
  },
  type: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 9,
    fontWeight: 'bold',
    lineHeight: 12,
    color: themeColor,
  },
  type_circle: {
    color: '#fff',
  },
  status: {
    marginLeft: 6,
    marginRight: 2,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#696D7F',
    lineHeight: 15,
  },
  pl_amount: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#C1C4D2',
    lineHeight: 17,
  },
  pl_amount_txt: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#C1C4D2',
    lineHeight: 15,
  },
  value: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555865',
    lineHeight: 15,
  },
  edit: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 11,
    fontWeight: 'bold',
    color: themeColor,
    lineHeight: 15,
  },
  edit_value: {
    color: themeColor,
  },
  edit_icon: {
    width: 11,
    height: 11,
    marginLeft: 3,
  },
});

export default Item;
