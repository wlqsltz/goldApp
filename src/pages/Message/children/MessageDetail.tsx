import React, {useEffect, useMemo, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {WebView} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {noticeDetail} from '@/api/message';
import {dateTimeFormat} from '@/utils/index';
import MsgDetailIcon from '@/assets/image/message/msg_detail.png';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'MessageDetail'>;
}

const MessageDetail: React.FC<IProps> = ({navigation, route}) => {
  const {message} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: message.type === '1' ? '公告详情' : '消息详情',
    });
  }, [message.type, navigation]);

  useEffect(() => {
    noticeDetail(message.id);
  }, [message.id]);

  const source = useMemo(() => {
    return {
      html:
        '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,user-scalable=yes" />' +
        message.content.replace('<img', '<img height="auto" width="100%"'),
    };
  }, [message.content]);

  return (
    <>
      <View style={styles.msg_detail}>
        <View style={styles.msg_detail_head}>
          <Text style={styles.detail_head_tit}>{message.title}</Text>
          <View style={styles.detail_summary}>
            <View style={styles.tip_box}>
              <Image style={styles.tip_icon} source={MsgDetailIcon} />
              <Text style={styles.dh_txt}>
                {message.type === '2' ? '消息' : '系统公告'}
              </Text>
            </View>
            <Text style={styles.detail_head_date}>
              {dateTimeFormat(message.updateDatetime)}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <WebView
            startInLoadingState
            source={source}
            mixedContentMode="always"
            scalesPageToFit={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  msg_detail: {
    backgroundColor: '#fff',
    flex: 1,
  },
  msg_detail_head: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  detail_head_tit: {
    marginBottom: 20,
    fontSize: 19,
    lineHeight: 27,
    color: '#333',
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  detail_head_date: {
    fontSize: 12,
    lineHeight: 17,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  detail_summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6E6',
  },
  tip_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tip_icon: {
    width: 23,
    height: 23,
  },
  dh_txt: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 7,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  container: {
    paddingHorizontal: 15,
    flex: 1,
  },
});

export default MessageDetail;
