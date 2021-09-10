import React, {useCallback} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import Touchable from '@/components/Touchable';
import SuccessIcon from '@/assets/image/message/success.png';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isAccept?: boolean;
}

const TgSucModal: React.FC<IProps> = ({visible, setVisible, isAccept}) => {
  // 关闭弹窗
  const closeModal = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const stopPropagation = useCallback((ev: GestureResponderEvent) => {
    ev.stopPropagation();
  }, []);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <Touchable
        activeOpacity={1}
        style={styles.container}
        onPress={closeModal}>
        <Touchable
          activeOpacity={1}
          onPress={stopPropagation}
          style={styles.content}>
          <View style={styles.head_box}>
            <Image style={styles.head_icon} source={SuccessIcon} />
            <Text style={styles.head}>
              {isAccept ? '托管成功' : '发送成功'}
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.body_text}>
              {isAccept
                ? '托管成功，请在「个人中心」-「托管账户」查看'
                : '托管意向发送成功，请等待操盘手联系您'}
            </Text>
          </View>
          <Touchable
            activeOpacity={1}
            onPress={closeModal}
            style={styles.button_box}>
            <Text style={styles.button}>我知道了</Text>
          </Touchable>
        </Touchable>
      </Touchable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  head_box: {
    alignItems: 'center',
  },
  head: {
    marginTop: 14,
    fontSize: 18,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 25,
  },
  head_icon: {
    width: 50,
    height: 50,
  },
  body: {
    marginTop: 18,
    alignItems: 'center',
  },
  body_text: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  button_box: {
    marginTop: 30,
    height: 44,
    backgroundColor: '#D59420',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
    lineHeight: 23,
  },
});

export default TgSucModal;
