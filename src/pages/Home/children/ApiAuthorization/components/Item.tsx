import React, {useCallback, useRef} from 'react';
import {Image, ImageBackground, Text, View, StyleSheet} from 'react-native';
import Swipeout from 'react-native-swipeout';
import GlobalStyles from '@/assets/style/global';
import EditIcon from '@/assets/image/home/apiAuthorization/edit.png';
import UnbindIcon from '@/assets/image/home/apiAuthorization/unbind.png';
import CurApiIcon from '@/assets/image/home/apiAuthorization/cur_api.png';
import HuobiIcon from '@/assets/image/home/apiAuthorization/huobi.png';
import HuobiBgIcon from '@/assets/image/home/apiAuthorization/huobi_bg.png';
import BianIcon from '@/assets/image/home/apiAuthorization/bian.png';
import BianBgIcon from '@/assets/image/home/apiAuthorization/bian_bg.png';
import Touchable from '@/components/Touchable';
import {dateTimeFormat, SCREEN_WIDTH} from '@/utils/index';
import {RootStackNavigation} from '@/navigator/index';

const themeColor = '#D59420';
const itemWidth = SCREEN_WIDTH - 30;

interface IProps {
  navigation: RootStackNavigation;
  data: IApiKey;
  chosed: boolean;
  onUnbind: (item: IApiKey) => void;
  onChose: (item: IApiKey) => void;
}

const Item: React.FC<IProps> = ({
  data,
  navigation,
  chosed,
  onUnbind,
  onChose,
}) => {
  const swipeRef = useRef<any>();

  // 修改
  const onEdit = useCallback(() => {
    swipeRef.current?._close();
    navigation.navigate('BindApi', {
      id: data.id,
      exchangeNo: data.exchangeNo,
    });
  }, [data.exchangeNo, data.id, navigation]);

  // 解绑
  const onUnbindClick = useCallback(() => {
    swipeRef.current?._close();
    onUnbind(data);
  }, [onUnbind, data]);

  // 切换交易所
  const onChoseClick = useCallback(() => {
    swipeRef.current?._close();
    onChose(data);
  }, [onChose, data]);

  return (
    <Swipeout
      ref={swipeRef}
      right={[
        {
          component: (
            <View style={styles.swi_view}>
              <Touchable
                onPress={onEdit}
                style={[styles.sw_single, GlobalStyles.bg_38b76b]}>
                <Image style={styles.sws_image} source={EditIcon} />
                <Text style={styles.sws_txt}>修改</Text>
              </Touchable>
              <Touchable
                onPress={onUnbindClick}
                style={[styles.sw_single, {backgroundColor: themeColor}]}>
                <Image style={styles.sws_image} source={UnbindIcon} />
                <Text style={styles.sws_txt}>解绑</Text>
              </Touchable>
            </View>
          ),
        },
      ]}
      backgroundColor="#fff"
      autoClose>
      <ImageBackground
        style={styles.item_bg}
        source={data.exchangeNo === '1' ? HuobiBgIcon : BianBgIcon}>
        {chosed ? (
          <View style={styles.tip_box_abs}>
            <Image style={styles.tip_img} source={CurApiIcon} />
          </View>
        ) : null}
        <View style={styles.back_topView}>
          <View style={GlobalStyles.flex_row}>
            <Image
              style={styles.huobi_icon}
              source={data.exchangeNo === '1' ? HuobiIcon : BianIcon}
            />
            <Text style={styles.huobi_name}>
              {data.exchangeNo === '1' ? '火币' : '币安'}
            </Text>
          </View>
          {!chosed ? (
            <Touchable onPress={onChoseClick} style={styles.tip_box}>
              <Text style={styles.tp__txt}>设为当前API</Text>
            </Touchable>
          ) : null}
        </View>
        <View style={styles.api_key_backView}>
          <Text
            style={styles.api_key}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            API Key：{data.accessKey}
          </Text>
        </View>
        <View style={[GlobalStyles.flex_row, GlobalStyles.flex_jc_sb]}>
          <Text style={styles.import_time_text}>
            授权时间：
            {dateTimeFormat(data.updateDatetime || data.createDatetime)}
          </Text>
        </View>
      </ImageBackground>
    </Swipeout>
  );
};

const styles = StyleSheet.create({
  swi_view: {
    flex: 1,
    paddingTop: 20,
    paddingRight: 15,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  sw_single: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sws_txt: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  sws_image: {
    width: 22,
    height: 22,
  },
  item_bg: {
    marginTop: 20,
    marginLeft: 15,
    width: itemWidth,
    height: 131,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tip_box_abs: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  tip_img: {
    width: 78,
    height: 29,
  },
  tip_box: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 15,
  },
  tp__txt: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  back_topView: {
    marginTop: 13.5,
    marginLeft: 0,
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  huobi_icon: {
    marginLeft: 15,
    width: 19,
    height: 29,
  },
  huobi_name: {
    marginLeft: 5,
    marginTop: 0,
    fontSize: 17,
    fontFamily: 'PingFangSC-Semibold',
    color: '#fff',
  },
  api_key_backView: {
    marginTop: 14.5,
    marginLeft: 0,
    height: 25.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  api_key: {
    marginTop: 2.5,
    marginLeft: 15,
    marginRight: 10,
    height: 23,
    lineHeight: 23,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    flex: 1,
  },
  import_time_text: {
    marginLeft: 15,
    marginTop: 12,
    height: 24.5,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Item;
