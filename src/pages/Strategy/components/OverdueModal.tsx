import React, {useCallback, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  Image,
} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import {useNavigation} from '@react-navigation/core';
import Touchable from '@/components/Touchable';
import {RootStackNavigation} from '@/navigator/index';
import IconFont from '@/assets/iconfont';
import HbApiIcon from '@/assets/image/strategy/hb-api.png';

const themeColor = '#D59420';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  apiKeyStatus: string;
}

const OverdueModal: React.FC<IProps> = React.memo(
  ({visible, setVisible, apiKeyStatus}) => {
    // 关闭弹窗
    const closeModal = useCallback(() => {
      setVisible(false);
    }, [setVisible]);
    const stopPropagation = useCallback((ev: GestureResponderEvent) => {
      ev.stopPropagation();
    }, []);
    const navigation = useNavigation<RootStackNavigation>();
    const goBindApi = useCallback(() => {
      setVisible(false);
      navigation.navigate('BindApi', {
        id: apiKeyStatus,
      });
    }, [apiKeyStatus, navigation, setVisible]);

    return (
      <Modal animationType="fade" transparent={true} visible={visible}>
        <RootSiblingParent>
          <Touchable
            activeOpacity={1}
            style={styles.container}
            onPress={closeModal}>
            <Touchable
              activeOpacity={1}
              onPress={stopPropagation}
              style={styles.content}>
              <View style={styles.head_box}>
                <Image style={styles.head_icon} source={HbApiIcon} />
              </View>
              <Touchable
                style={styles.close_box}
                activeOpacity={1}
                onPress={closeModal}>
                <IconFont name="icon-close" size={20} color="#BFBFBF" />
              </Touchable>
              <Text style={styles.title}>API已过期，请重新绑定</Text>
              <Touchable onPress={goBindApi} style={styles.btn}>
                <Text style={styles.btn_txt}>立即绑定</Text>
              </Touchable>
            </Touchable>
          </Touchable>
        </RootSiblingParent>
      </Modal>
    );
  },
);

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
    paddingHorizontal: 21,
    paddingTop: 35,
    paddingBottom: 25,
    position: 'relative',
  },
  head_box: {
    alignItems: 'center',
  },
  head_icon: {
    width: 160,
    height: 120,
  },
  title: {
    marginTop: 27,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  close_box: {
    width: 29,
    height: 29,
    position: 'absolute',
    top: 17,
    right: 15,
  },
  btn: {
    marginTop: 28,
    height: 50,
    backgroundColor: themeColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#fff',
    lineHeight: 23,
  },
});

export default OverdueModal;
