import React, {useCallback, useState} from 'react';
import {
  Modal,
  View,
  Text,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import Touchable from '@/components/Touchable';
import IconFont from '@/assets/iconfont';

const themeColor = '#D59420';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  subTitle: string;
  descriptions: string[];
  btnText: string;
  onConfirm?: () => Promise<void>;
  hideCloseIcon?: boolean;
}

const CommonModal: React.FC<IProps> = React.memo(
  ({
    visible,
    setVisible,
    title,
    subTitle,
    descriptions,
    btnText,
    onConfirm,
    hideCloseIcon = false,
  }) => {
    const handleCloseModal = useCallback(
      (_: GestureResponderEvent) => {
        setVisible(false);
      },
      [setVisible],
    );
    const stopPropagation = useCallback((ev: GestureResponderEvent) => {
      ev.stopPropagation();
    }, []);
    const [disabled, setDisabled] = useState(false);
    const handleBtnClick = useCallback(
      async (ev: GestureResponderEvent) => {
        ev.stopPropagation();
        setDisabled(true);
        if (onConfirm) {
          try {
            await onConfirm();
          } catch (error) {}
        }
        setDisabled(false);
        setVisible(false);
      },
      [onConfirm, setVisible],
    );
    return (
      <Modal animationType="fade" transparent={true} visible={visible}>
        <Touchable
          style={styles.container}
          activeOpacity={1}
          onPress={handleCloseModal}>
          <Touchable
            style={styles.content}
            activeOpacity={1}
            onPress={stopPropagation}>
            {!hideCloseIcon ? (
              <Touchable onPress={handleCloseModal} style={styles.close}>
                <IconFont name="icon-close" size={19} color="#BFBFBF" />
              </Touchable>
            ) : null}
            <Text style={[styles.title, !hideCloseIcon && styles.title_icon]}>
              {title}
            </Text>
            <View style={styles.sub_title}>
              <IconFont name="icon-tip" size={16} color={themeColor} />
              <Text style={styles.sub_title_txt}>{subTitle}</Text>
            </View>
            {descriptions ? (
              <View style={styles.descriptions}>
                {descriptions.map((desc, index) => (
                  <Text style={styles.description} key={index}>
                    {index + 1}.{desc}
                  </Text>
                ))}
              </View>
            ) : null}
            <Touchable
              disabled={disabled}
              style={styles.btn}
              onPress={handleBtnClick}>
              <Text style={styles.btn_txt}>{btnText}</Text>
            </Touchable>
          </Touchable>
        </Touchable>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 320,
    paddingTop: 24,
    paddingBottom: 17,
    paddingHorizontal: 21,
  },
  title: {
    color: '#333333',
    fontSize: 18,
    lineHeight: 25,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    marginBottom: 17,
  },
  title_icon: {
    paddingRight: 19,
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 13,
    padding: 4,
  },
  sub_title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sub_title_txt: {
    marginLeft: 4,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: themeColor,
    lineHeight: 20,
  },
  descriptions: {
    marginTop: 11,
  },
  description: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999999',
    lineHeight: 23,
  },
  btn: {
    marginTop: 23,
    borderRadius: 4,
    backgroundColor: themeColor,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#fff',
    lineHeight: 23,
  },
});

export default CommonModal;
