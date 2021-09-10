import React, {useCallback, useEffect, useMemo} from 'react';
import {Image, InteractionManager, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {MarqueeVertical} from 'react-native-marquee-ab';
import MessageIcon from '@/assets/image/home/message.png';
import IconFont from '@/assets/iconfont';
import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import {SCREEN_WIDTH} from '@/utils/index';
import {RootStackNavigation} from '@/navigator/index';

interface IProps {}

const selectMessageList = createSelector(
  (state: RootState) => state.home,
  home => home.messageList,
);

const Message: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const messageList = useSelector(selectMessageList);
  const msgList = useMemo(
    () =>
      messageList.map((item, index) => ({
        value: item.title,
        label: index.toString(),
      })),
    [messageList],
  );

  const navigation = useNavigation<RootStackNavigation>();
  const goMessageDetail = useCallback(
    ({label}: {value: string; label: string}) => {
      navigation.navigate('MessageDetail', {
        message: messageList[+label],
      });
    },
    [messageList, navigation],
  );
  const goMessageList = useCallback(() => {
    console.log('click messageList');
    dispatch({
      type: 'message/setState',
      payload: {
        activeIndex: 1,
      },
    });
    setTimeout(() => {
      navigation.navigate('BottomTabs', {
        screen: 'Message',
      });
    }, 50);
  }, [dispatch, navigation]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch({
        type: 'home/getMessages',
      });
    });
    return () => task.cancel();
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.image} source={MessageIcon} />
        <View style={styles.carousel}>
          <MarqueeVertical
            textList={msgList}
            width={SCREEN_WIDTH - 30 - 19 - 15}
            height={30}
            direction={'up'}
            duration={1200}
            delay={4000}
            numberOfLines={1}
            bgContainerStyle={styles.carousel_bg}
            textStyle={styles.item_txt}
            onTextClick={goMessageDetail}
          />
        </View>
        <Touchable onPress={goMessageList} style={styles.more}>
          <IconFont name="icon-more" size={15} />
        </Touchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E3E6',
  },
  image: {
    width: 19,
    height: 19,
  },
  carousel: {
    flex: 1,
    height: 24,
  },
  carousel_bg: {
    backgroundColor: 'transparent',
  },
  more: {
    paddingVertical: 2,
  },
  item_txt: {
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#333',
    lineHeight: 20,
    marginTop: -4,
  },
});

export default Message;
