import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Avatar from '@/components/Avatar';
import {styles} from './StrategyCard';
import IconFont from '@/assets/iconfont';

const themeColor = '#D59420';

interface Props {
  info: any;
  type: string;
}

export default function BillItem({info, type}: Props) {
  const goBillPage = useCallback(async () => {
    // await saveMsg('accountId', info.accountId);
    // NavigatorUtil.goPage('ElectronicBilling', {
    //   accountId: info.accountId,
    // });
  }, [info]);
  return (
    <View style={[styles.container, styles.mt_15]}>
      <View style={styles.top_box}>
        <Avatar style={styles.avatar} uri={info.photo} />
        <View style={styles.msg_box}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
            {info.nickname || '--'}
          </Text>
          <View style={styles.rate_box}>
            <Text style={styles.rate_label}>授权金额: </Text>
            <Text style={styles.rate_value}>
              {'grantAmount' in info ? `${info.grantAmount}` : '--'}
            </Text>
            <Text style={[styles.rate_label, styles.ml_15]}>
              {type === 'gd' ? '跟单费' : '托管费'}:{' '}
            </Text>
            <Text style={styles.rate_value}>
              {'fee' in info ? `${info.fee}%` : '--'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={goBillPage}>
          <Text style={styles.button_txt}>查看详情</Text>
          <IconFont name="icon-right" size={10} color={themeColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottom_box}>
        <View style={styles.item_box}>
          <Text style={styles.item_title}>今日收益</Text>
          <Text style={[styles.item_value, styles.item_value_primary]}>
            {'amount' in info ? `+${info.amount}` : '--'}
          </Text>
        </View>
        <View style={styles.item_box_right}>
          <Text style={styles.item_title}>累计收益</Text>
          <Text style={[styles.item_value, styles.item_value_primary]}>
            {'totalAmount' in info ? `+${info.totalAmount}` : '--'}
          </Text>
        </View>
      </View>
    </View>
  );
}
