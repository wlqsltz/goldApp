import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  Modal,
  GestureResponderEvent,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import Avatar from '@/components/Avatar';
import Touchable from '@/components/Touchable';
import {entrustContractHandle} from '@/api/message';
import TgModalBgIcon from '@/assets/image/message/tg_modal_bg.png';
import MoneyIcon from '@/assets/image/message/money.png';
import RateIcon from '@/assets/image/message/rate.png';
import CloseIcon from '@/assets/image/message/close.png';

const themeColor = '#D59420';

export interface ITgMsg {
  id: string;
  isRefuse: boolean;
  startDate?: string;
  endDate?: string;
  entrustAmount: string;
  stopRatio: string;
  entrustFee: string;
  reason: string;
  photo: string;
  nickname: string;
  days: string;
  operatorId?: string;
}

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onRefuse: () => void;
  onConfirm: () => void;
  onReApply: () => void;
  tgMsg?: ITgMsg;
}

const TgMsgModal: React.FC<IProps> = ({
  visible,
  setVisible,
  onRefuse,
  onConfirm,
  onReApply,
  tgMsg,
}) => {
  const stopPropagation = useCallback((ev: GestureResponderEvent) => {
    ev.stopPropagation();
  }, []);
  const startDate = useMemo(() => {
    if (!tgMsg || !tgMsg.startDate) {
      return '';
    }
    return tgMsg.startDate.replace(/-/g, '/');
  }, [tgMsg]);
  const endDate = useMemo(() => {
    if (!tgMsg || !tgMsg.endDate) {
      return '';
    }
    return tgMsg.endDate.replace(/-/g, '/');
  }, [tgMsg]);

  const [loading, setLoading] = useState(false);
  // 申请托管时展示的内容
  const renderApplyContent = useCallback(() => {
    return (
      <>
        <View style={styles.amont_box}>
          <Text style={styles.amount_title}>托管金额：</Text>
          <Text style={styles.amount}>
            {!tgMsg
              ? ''
              : +tgMsg.entrustAmount > 0
              ? tgMsg.entrustAmount
              : '全额'}{' '}
            USDT
          </Text>
        </View>
        <View style={styles.explain_item}>
          <Image style={styles.explain_icon} source={RateIcon} />
          <View style={styles.explain_content}>
            <View style={styles.explain_title_box}>
              <Text style={styles.explain_title}>止 损 率：</Text>
              <Text style={styles.explain_value}>{tgMsg?.stopRatio}%</Text>
            </View>
            <Text style={styles.explain_tip}>
              当盈利率低于或等于止损率时系统会自动强制平仓，并归还平仓后的全部资金。
            </Text>
          </View>
        </View>
        <View style={styles.explain_item}>
          <Image style={styles.explain_icon1} source={MoneyIcon} />
          <View style={styles.explain_content}>
            <View style={styles.explain_title_box}>
              <Text style={styles.explain_title}>托 管 费：</Text>
              <Text style={styles.explain_value}>{tgMsg?.entrustFee}%</Text>
            </View>
            <Text style={styles.explain_tip}>
              托管费=当日您的托管盈利*托管费占比，每日0点自动从您的佣金钱包扣除。
            </Text>
          </View>
        </View>
      </>
    );
  }, [tgMsg]);
  // 拒绝
  const handleRefuse = useCallback(async () => {
    try {
      if (!tgMsg) {
        return;
      }
      setLoading(true);
      await entrustContractHandle({
        id: tgMsg.id,
        status: '-1',
      });
      setVisible(false);
      onRefuse();
    } catch (error) {}
    setLoading(false);
  }, [tgMsg, setVisible, onRefuse]);
  // 接受
  const handleConfirm = useCallback(async () => {
    try {
      if (!tgMsg) {
        return;
      }
      setLoading(true);
      await entrustContractHandle({
        id: tgMsg.id,
        status: '1',
      });
      setVisible(false);
      onConfirm();
    } catch (error) {}
    setLoading(false);
  }, [tgMsg, setVisible, onConfirm]);
  // 申请托管时展示的底部按钮
  const renderApplyFooter = useCallback(() => {
    return (
      <View style={styles.bottom_box}>
        <Touchable
          disabled={loading}
          onPress={handleRefuse}
          style={[styles.btn, styles.btn_cancel]}>
          <Text style={[styles.btn_txt, styles.btn_txt_cancel]}>拒绝</Text>
        </Touchable>
        <Touchable onPress={handleConfirm} style={styles.btn}>
          <Text style={styles.btn_txt}>接受</Text>
        </Touchable>
      </View>
    );
  }, [handleRefuse, handleConfirm, loading]);
  // 托管被拒绝后展示的内容
  const renderRefuseContent = useCallback(() => {
    return (
      <>
        <View style={styles.refuse_box}>
          <Text style={styles.refuse_title}>拒绝理由</Text>
          <Text style={styles.refuse_reason}>{tgMsg?.reason}</Text>
        </View>
        <View style={styles.msg_box}>
          <Text style={styles.msg_head}>您发起的托管意向</Text>
          <View style={styles.msg_item}>
            <Text style={styles.msg_title}>授权金额(USDT)</Text>
            <Text style={styles.msg_con}>
              {!tgMsg
                ? ''
                : +tgMsg.entrustAmount > 0
                ? tgMsg.entrustAmount
                : '全额'}
            </Text>
          </View>
          <View style={styles.msg_item}>
            <Text style={styles.msg_title}>止损率</Text>
            <Text style={styles.msg_con}>{tgMsg?.stopRatio}%</Text>
          </View>
        </View>
      </>
    );
  }, [tgMsg]);
  // 重新发起托管意向
  const handleReApply = useCallback(() => {
    setVisible(false);
    onReApply();
  }, [onReApply, setVisible]);
  // 托管被拒绝后展示的底部按钮
  const renderRefuseFooter = useCallback(() => {
    return (
      <View style={styles.refuse_bottom_box}>
        <Touchable
          disabled={loading}
          onPress={handleReApply}
          style={styles.btn}>
          <Text style={styles.btn_txt}>重新发起托管意向</Text>
        </Touchable>
      </View>
    );
  }, [handleReApply, loading]);

  const onClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <RootSiblingParent>
        <Touchable style={styles.md_center} activeOpacity={1} onPress={onClose}>
          <Touchable
            style={styles.container}
            activeOpacity={1}
            onPress={stopPropagation}>
            <Avatar uri={tgMsg?.photo} style={styles.avatar} />
            <Touchable onPress={onClose} style={styles.close}>
              <Image source={CloseIcon} style={styles.close_img} />
            </Touchable>
            <ImageBackground style={styles.top_bg} source={TgModalBgIcon}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.nickname}>
                {tgMsg?.nickname}
              </Text>
              <Text style={styles.tip}>
                {tgMsg?.isRefuse ? '拒绝了您的托管意向' : '邀请你进行账户托管'}
              </Text>
              <Text style={[styles.tip, styles.sub_tip]}>
                托管时段：{startDate}-{endDate}(共{tgMsg?.days}天)
              </Text>
            </ImageBackground>
            <View style={styles.center_box}>
              {tgMsg?.isRefuse ? renderRefuseContent() : renderApplyContent()}
            </View>
            {tgMsg?.isRefuse ? renderRefuseFooter() : renderApplyFooter()}
          </Touchable>
        </Touchable>
      </RootSiblingParent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  md_center: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    width: 305,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: themeColor,
    position: 'absolute',
    top: -37.5,
    left: 115,
    zIndex: 99,
  },
  close: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 99,
  },
  close_img: {
    width: 30,
    height: 30,
  },
  top_bg: {
    width: '100%',
    height: 120,
    alignItems: 'center',
  },
  nickname: {
    marginTop: 47,
    fontSize: 16,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 23,
  },
  tip: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
    lineHeight: 15,
  },
  sub_tip: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
  },
  center_box: {
    paddingHorizontal: 28,
    paddingVertical: 18,
  },
  amont_box: {
    paddingBottom: 16,
    borderBottomColor: '#E3E3EA',
    borderBottomWidth: 1,
  },
  amount_title: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    color: '#7E7D8B',
    lineHeight: 17,
  },
  amount: {
    marginTop: 7,
    fontSize: 17,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    color: '#696874',
    lineHeight: 20,
  },
  explain_item: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 2,
    alignItems: 'flex-start',
  },
  explain_icon: {
    marginTop: 3,
    width: 14,
    height: 13,
  },
  explain_icon1: {
    marginTop: 1,
    width: 15,
    height: 16,
  },
  explain_content: {
    paddingLeft: 4,
    flex: 1,
  },
  explain_title_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  explain_title: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    lineHeight: 17,
    color: '#7E7D8B',
  },
  explain_value: {
    fontSize: 13,
    fontFamily: 'DINAlternate-Bold',
    color: '#696874',
    lineHeight: 15,
  },
  explain_tip: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: 'PingFangSC-Regular',
    color: '#C1C4D2',
    lineHeight: 14,
  },
  bottom_box: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 29,
  },
  btn: {
    flex: 1,
    height: 43,
    backgroundColor: themeColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  btn_cancel: {
    marginRight: 19,
    height: 41,
    borderWidth: 1,
    borderColor: themeColor,
    backgroundColor: '#fff',
  },
  btn_txt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 23,
  },
  btn_txt_cancel: {
    color: themeColor,
  },
  refuse_box: {
    backgroundColor: '#F7F7FA',
    width: '100%',
    paddingVertical: 10,
    paddingRight: 13,
    paddingLeft: 15,
    borderRadius: 6,
  },
  refuse_title: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#696874',
    lineHeight: 19,
  },
  refuse_reason: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#A4A4AC',
    lineHeight: 17,
  },
  msg_box: {
    marginTop: 15,
  },
  msg_head: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#696874',
    lineHeight: 19,
    marginBottom: 1,
  },
  msg_item: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  msg_title: {
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
    color: '#A4A4AC',
    lineHeight: 15,
  },
  msg_con: {
    fontSize: 13,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    color: '#A4A4AC',
    lineHeight: 15,
  },
  refuse_bottom_box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 29,
  },
});

export default TgMsgModal;
