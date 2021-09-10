import React, {useMemo, useCallback} from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import Avatar from '@/components/Avatar';
import Touchable from '@/components/Touchable';
import CpsBgIcon from '@/assets/image/home/cps_bg.png';
import Top1Icon from '@/assets/image/home/top1.png';
import Top2Icon from '@/assets/image/home/top2.png';
import Top3Icon from '@/assets/image/home/top3.png';

interface Props {
  info: IOperator;
  rank: number;
}

export default function CpsItem({info, rank}: Props) {
  const url = useMemo(() => {
    return rank === 1 ? Top1Icon : rank === 2 ? Top2Icon : Top3Icon;
  }, [rank]);
  const avatarStyle = useMemo(() => {
    return rank === 1
      ? styles.avatar_rank1
      : rank === 2
      ? styles.avatar_rank2
      : styles.avatar_rank3;
  }, [rank]);
  const boxStyle = useMemo(() => {
    return rank === 1
      ? styles.avatar_box_rank1
      : rank === 2
      ? styles.avatar_box_rank2
      : styles.avatar_box_rank3;
  }, [rank]);
  const totalIncomeAmount = useMemo(() => {
    const value = parseFloat(info.totalIncomeAmount);
    if (!Number.isNaN(value)) {
      return value.toFixed(4);
    }
    return '0.0000';
  }, [info.totalIncomeAmount]);

  const goTraderDetail = useCallback(async () => {
    console.log('goTraderDetail', info);
  }, [info]);

  return (
    <Touchable style={styles.container} onPress={goTraderDetail}>
      <Image style={[styles.bg]} source={CpsBgIcon} />
      <View style={styles.inner_box}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
          {info.nickname}
        </Text>
        <Text style={[styles.rate, styles.rate_up]}>{totalIncomeAmount}</Text>
        <Text style={styles.tip}>累计盈利</Text>
        <View style={[styles.avatar_box, boxStyle]}>
          <View style={[styles.avatar_inner_box, avatarStyle]}>
            <Avatar style={styles.avatar} uri={info.photo} />
          </View>
        </View>
        <Image style={styles.rank} source={url} />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    height: 189,
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 117,
    height: 184,
    resizeMode: 'stretch',
  },
  inner_box: {
    marginTop: 9,
    width: 96,
    height: 169,
    alignItems: 'center',
  },
  title: {
    width: Platform.OS !== 'ios' ? 90 : 75,
    marginTop: 13,
    fontSize: 15,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 21,
    textAlign: 'center',
  },
  rate: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',
  },
  rate_up: {
    color: '#2CAD70',
  },
  rate_down: {
    color: '#E15151',
  },
  rank: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    width: 66,
    height: 20,
  },
  tip: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: 'PingFangSC-Regular',
    color: '#A4A4AC',
    lineHeight: 14,
    textAlign: 'center',
  },
  avatar_box: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatar_box_rank1: {
    backgroundColor: 'rgba(254, 158, 4, 0.11)',
  },
  avatar_box_rank2: {
    backgroundColor: 'rgba(255, 128, 90, 0.11)',
  },
  avatar_box_rank3: {
    backgroundColor: 'rgba(176, 189, 254, 0.11)',
  },
  avatar_inner_box: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar_rank1: {
    borderColor: '#FFCF78',
  },
  avatar_rank2: {
    borderColor: '#FF8C67',
  },
  avatar_rank3: {
    borderColor: '#A4B2FA',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
