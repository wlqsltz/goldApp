import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ListRenderItemInfo,
  Text,
  InteractionManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SnapCarousel, {Pagination} from 'react-native-snap-carousel';
import {createSelector} from 'reselect';
import {RootState} from '@/models/index';
import {SCREEN_WIDTH, toast} from '@/utils/index';
import BgIcon from '@/assets/image/message/bg.png';
import Avatar from '@/components/Avatar';
import Touchable from '@/components/Touchable';
import {
  entrustContractDetailFront,
  intentionRecordDetail,
  noticeDetail,
} from '@/api/message';
import TgMsgModal, {ITgMsg} from './TgMsgModal';
import {useFocusEffect} from '@react-navigation/native';
import TgSucModal from './TgSucModal';
import ApplyTgModal from './ApplyTgModal';

interface IProps {}
const themeColor = '#D59420';

const itemWidth = SCREEN_WIDTH - 14;

const selectTgMessagelList = createSelector(
  (state: RootState) => state.message,
  message => message.tgMessageList,
);

const Carousel: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const tgMessageList = useSelector(selectTgMessagelList);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        dispatch({
          type: 'message/getTgMessages',
        });
      });

      return () => task.cancel();
    }, [dispatch]),
  );

  const [tgMsgVisible, setTgMsgVisible] = useState(false);
  const [tgMsg, setTgMsg] = useState<ITgMsg>();

  const handleWatch = useCallback((item: ITgMessage) => {
    if (item.refType !== 'tg refuse') {
      // 不是被拒绝的托管消息
      entrustContractDetailFront(item.refNo).then((res: any) => {
        setTgMsg({
          ...res,
          id: item.refNo,
          isRefuse: false,
        });
        setTgMsgVisible(true);
      });
    } else {
      intentionRecordDetail(item.refNo).then((res: any) => {
        setTgMsg({
          ...res,
          id: item.refNo,
          isRefuse: true,
          photo: res.user.photo,
          nickname: res.user.nickname,
        });
        setTgMsgVisible(true);
      });
    }
  }, []);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ITgMessage>) => {
      return (
        <ImageBackground source={BgIcon} style={styles.item_box}>
          <Avatar key={item.id} style={styles.avatar} uri={item.photo} />
          <View style={styles.msg_box}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles.nickname}>
              {item.nickname}
            </Text>
            <Text style={styles.tip}>
              {item.refType !== 'tg refuse'
                ? '邀请您进行账户托管'
                : '拒绝了您的托管意向'}
            </Text>
          </View>
          <Touchable style={styles.btn} onPress={() => handleWatch(item)}>
            <Text style={styles.btn_txt}>查看</Text>
          </Touchable>
        </ImageBackground>
      );
    },
    [handleWatch],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const onSnapToItem = (index: number) => {
    setActiveIndex(index);
  };
  const pagination = useMemo(
    () => (
      <View style={styles.pagination_wrapper}>
        <Pagination
          containerStyle={styles.pagination_container}
          dotContainerStyle={styles.dot_container}
          dotStyle={styles.dot}
          inactiveDotStyle={[styles.dot, styles.dot_inactive]}
          activeDotIndex={activeIndex}
          dotsLength={tgMessageList.length}
          inactiveDotScale={1}
          inactiveDotOpacity={1}
        />
      </View>
    ),
    [tgMessageList, activeIndex],
  );

  const onRefresh = useCallback(() => {
    dispatch({
      type: 'message/getTgMessages',
    });
    dispatch({
      type: 'message/getMessages',
    });
    dispatch({
      type: 'message/getUnReadCount',
    });
  }, [dispatch]);

  const onRefuse = useCallback(() => {
    toast('已拒绝该托管请求');
    onRefresh();
  }, [onRefresh]);

  const [tgSucVisible, setTgSucVisible] = useState(false);
  // 接受托管意向
  const onConfirm = useCallback(() => {
    onRefresh();
    setTgSucVisible(true);
  }, [onRefresh]);

  const [tgApplyVisible, setTgApplyVisible] = useState(false);
  // 重新发起托管意向
  const onReApply = useCallback(() => {
    setTgApplyVisible(true);
    setIsAccept(true);
  }, []);
  // 是接受了托管邀请，还是重新发起托管意向成功
  const [isAccept, setIsAccept] = useState(false);
  // 重新发起托管意向成功
  const onReApplySuccess = useCallback(() => {
    setTgSucVisible(true);
    setIsAccept(false);
  }, []);

  if (!tgMessageList.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      <SnapCarousel
        data={tgMessageList}
        renderItem={renderItem}
        sliderWidth={itemWidth}
        itemWidth={itemWidth}
        onSnapToItem={onSnapToItem}
        loop
        autoplay
        autoplayDelay={5000}
        autoplayInterval={5000}
      />
      {pagination}
      <TgMsgModal
        visible={tgMsgVisible}
        setVisible={setTgMsgVisible}
        onRefuse={onRefuse}
        onConfirm={onConfirm}
        onReApply={onReApply}
        tgMsg={tgMsg}
      />
      <ApplyTgModal
        visible={tgApplyVisible}
        setVisible={setTgApplyVisible}
        id={tgMsg?.operatorId || ''}
        reApplyId={tgMsg?.isRefuse ? tgMsg.id : ''}
        sendSuccess={onReApplySuccess}
      />
      <TgSucModal
        visible={tgSucVisible}
        setVisible={setTgSucVisible}
        isAccept={isAccept}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 9,
  },
  item_box: {
    width: itemWidth,
    flexDirection: 'row',
    alignItems: 'center',
    height: 92,
    paddingLeft: 22,
    paddingRight: 24,
    resizeMode: 'cover',
  },
  avatar: {
    width: 53,
    height: 53,
    borderRadius: 53,
    borderWidth: 2,
    borderColor: '#FAD69A',
  },
  indicatorContainer: {
    bottom: -7,
  },
  msg_box: {
    marginLeft: 8,
    marginRight: 10,
    paddingVertical: 2,
    flex: 1,
  },
  nickname: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 20,
  },
  tip: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
    lineHeight: 17,
  },
  btn: {
    width: 58,
    height: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_txt: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#D59420',
    lineHeight: 19,
  },
  pagination_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  pagination_container: {
    position: 'absolute',
    top: -4,
    paddingHorizontal: 3,
    paddingVertical: 4,
  },
  dot_container: {
    marginHorizontal: 4,
  },
  dot: {
    width: 12,
    height: 3,
    backgroundColor: themeColor,
  },
  dot_inactive: {
    backgroundColor: 'rgba(213, 148, 32, 0.3)',
  },
});

export default Carousel;
