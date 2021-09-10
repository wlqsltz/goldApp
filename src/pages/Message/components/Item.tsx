import React, {useCallback} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import MsgIcon from '@/assets/image/message/msg.png';
import NoticeIcon from '@/assets/image/message/notice.png';
import {dateTimeFormat} from '@/utils/index';
import Touchable from '@/components/Touchable';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '@/navigator/index';

interface IProps {
  data: IMessage;
}

const Item: React.FC<IProps> = ({data}) => {
  const navigation = useNavigation<RootStackNavigation>();
  const goDetail = useCallback(() => {
    navigation.navigate('MessageDetail', {
      message: data,
    });
  }, [data, navigation]);
  return (
    <Touchable onPress={goDetail} style={styles.container}>
      <View style={styles.image_box}>
        <Image
          style={styles.image}
          source={data.type === '1' ? NoticeIcon : MsgIcon}
        />
        {data.isRead !== '1' ? <View style={styles.unread} /> : null}
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.title, data.isRead !== '1' && styles.title_unread]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {data.title}
        </Text>
        <View style={styles.bottom}>
          <Text style={styles.tip}>{dateTimeFormat(data.updateDatetime)}</Text>
          <Text style={styles.tip}>{data.type === '1' ? '公告' : '消息'}</Text>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  image_box: {
    position: 'relative',
    width: 45,
    height: 45,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  unread: {
    width: 7,
    height: 7,
    backgroundColor: '#E94B4B',
    borderRadius: 7,
    position: 'absolute',
    top: 1,
    right: 1,
  },
  content: {
    flex: 1,
    paddingTop: 3,
    paddingBottom: 1,
    paddingLeft: 11,
  },
  title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#999',
    lineHeight: 21,
  },
  title_unread: {
    color: '#333',
  },
  bottom: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tip: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#C2C2C2',
    lineHeight: 17,
  },
});

export default Item;
