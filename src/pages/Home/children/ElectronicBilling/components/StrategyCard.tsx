import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {useNavigation} from '@react-navigation/native';
import Avatar from '@/components/Avatar';
import IconFont from '@/assets/iconfont';
import {RootState} from '@/models/index';
import {RootStackNavigation} from '@/navigator/index';
import { SCREEN_WIDTH } from '@/utils/';

const themeColor = '#D59420';
const boxWidth = SCREEN_WIDTH - 30;

interface Props {
  info: IElectronicBilling;
}

const selectUser = createSelector(
  (state: RootState) => state.user,
  user => user.user,
);

export default function StrategyCard({info}: Props) {
  const userInfo = useSelector(selectUser);
  const navigation = useNavigation<RootStackNavigation>();
  const goBillPage = useCallback(async () => {
    // await saveMsg('accountId', userInfo.accountId);
    // navigation.navigate('ElectronicBilling');
  }, [userInfo, navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.top_box}>
        <Avatar style={styles.avatar} uri={userInfo?.photo} />
        <View style={styles.msg_box}>
          <Text style={styles.name}>{userInfo?.nickname || '--'}</Text>
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
            {'dayIncomeAmount' in info ? `+${info.dayIncomeAmount}` : '--'}
          </Text>
        </View>
        <View style={styles.item_box_right}>
          <Text style={styles.item_title}>累计收益</Text>
          <Text style={[styles.item_value, styles.item_value_primary]}>
            {'cumulativeIncome' in info ? `+${info.cumulativeIncome}` : '--'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    marginTop: -66,
    marginLeft: 15,
    width: boxWidth,
    height: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  top_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    resizeMode: 'cover',
    borderRadius: 22.5,
  },
  msg_box: {
    marginLeft: 7,
    flex: 1,
  },
  name: {
    marginTop: 2,
    fontSize: 17,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 24,
  },
  rate_box: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rate_label: {
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
    color: '#BCBDC2',
    lineHeight: 15,
  },
  rate_value: {
    fontSize: 12,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    color: '#BCBDC2',
    lineHeight: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  button_txt: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: themeColor,
    lineHeight: 17,
    marginRight: 2,
  },
  button_icon: {
    marginLeft: 2,
    width: 10,
    height: 10,
  },
  bottom_box: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item_title: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#BCBDC2',
    lineHeight: 17,
  },
  item_value: {
    marginTop: 2,
    fontSize: 16,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 19,
  },
  item_box: {
    flex: 1,
  },
  item_value_primary: {
    color: '#2BAD6F',
  },
  item_box_right: {
    alignItems: 'flex-end',
  },
  ml_15: {
    marginLeft: 15,
  },
  mt_15: {
    marginTop: 15,
  },
});
