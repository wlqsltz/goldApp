import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Touchable from '@/components/Touchable';
import {RootStackNavigation} from '@/navigator/index';
import {useNavigation} from '@react-navigation/core';
import Avatar from '@/components/Avatar';
import CheckedIcon from '@/assets/image/home/cpsList/checked.png';

const themeColor = '#D59420';

interface IProps {
  data: IOperator;
}

const Item: React.FC<IProps> = ({data}) => {
  const navigation = useNavigation<RootStackNavigation>();
  const goDetail = useCallback(() => {
    // navigation.navigate('');
  }, [navigation]);

  return (
    <Touchable style={styles.tds_single} onPress={goDetail}>
      <View style={styles.tds_s_l}>
        <View style={styles.tds_s_l_inner}>
          <View
            style={[
              styles.tds_s_l_pic,
              data.openStatus === '1' ? styles.tds_s_l_pic_open : null,
            ]}>
            <Avatar uri={data.photo} style={styles.avatar} />
            <View
              style={[
                styles.tds_s_l_pic_circle,
                data.openStatus === '1' ? styles.tds_s_l_pic_circle_open : null,
              ]}
            />
          </View>
          <View style={[styles.tip_box]} />
        </View>
        <View style={styles.sl_box}>
          <View style={styles.sl_box_tit}>
            <View style={styles.sl_box_tit_l}>
              <Text style={styles.sl_tit} numberOfLines={1}>
                {data.nickname}
              </Text>
              <View
                style={[
                  styles.sl_tit_tag_wrap,
                  data.openStatus === '1' ? styles.sl_tit_tag_wrap_open : null,
                ]}>
                <Text
                  style={[
                    styles.sl_tit_tag,
                    data.openStatus === '1' ? styles.sl_tit_tag_open : null,
                  ]}>
                  {data.openStatus === '1' ? '跟单已开启' : '跟单未开启'}
                </Text>
              </View>
            </View>
            {data.isJoinFlag === '1' ? (
              <View style={styles.sl_box_tit_r}>
                <Image style={styles.sl_box_tit_r_img} source={CheckedIcon} />
                <Text style={styles.sl_box_tit_r_txt}>跟单中</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.sl_txt_wrap}>
            <Text style={styles.sl_txt}>
              今日盈利：
              <Text style={styles.sl_txt_bold}>{data.todayIncome}</Text>
            </Text>
            <Text style={styles.sl_txt}>
              累计盈利：
              <Text style={styles.sl_txt_bold}>{data.totalIncome}</Text>
            </Text>
          </View>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  tds_single: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tds_s_l: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tds_s_l_inner: {
    position: 'relative',
    flexShrink: 0,
  },
  tds_s_l_pic: {
    width: 50,
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 50,
    position: 'relative',
  },
  tds_s_l_pic_open: {
    borderColor: themeColor,
  },
  tds_s_l_pic_circle: {
    width: 10,
    height: 10,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    position: 'absolute',
    top: 2,
    right: -1,
  },
  tds_s_l_pic_circle_open: {
    backgroundColor: themeColor,
  },
  tip_box: {},
  sl_box: {
    flex: 1,
    marginLeft: 10,
  },
  sl_box_tit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sl_box_tit_l: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sl_box_tit_r_txt: {
    fontSize: 12,
    color: themeColor,
    fontFamily: 'PingFangSC-Regular',
  },
  sl_tit: {
    maxWidth: 150,
    color: '#333333',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  sl_tit_tag_wrap: {
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: 11,
    backgroundColor: '#DDDCDA',
    overflow: 'hidden',
    marginLeft: 5,
  },
  sl_tit_tag: {
    color: '#999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  sl_tit_tag_wrap_open: {
    backgroundColor: '#FAD69A',
  },
  sl_tit_tag_open: {
    color: themeColor,
  },
  sl_box_tit_r: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sl_box_tit_r_img: {
    width: 13.5,
    height: 13.5,
    marginRight: 3,
  },
  sl_txt_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sl_txt: {
    color: '#999999',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  sl_txt_bold: {
    color: '#696874',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'DINAlternate-Bold',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
});

export default Item;
