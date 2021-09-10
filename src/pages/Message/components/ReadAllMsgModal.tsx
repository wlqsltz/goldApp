import React, {useCallback} from 'react';
import {
  Text,
  View,
  GestureResponderEvent,
  Modal,
  StyleSheet,
} from 'react-native';
import Touchable from '@/components/Touchable';
import {smsReadNotice} from '@/api/message';

const themeColor = '#D59420';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onConfirm: () => void;
}

const ReadAllMsgModal: React.FC<IProps> = React.memo(
  ({visible, setVisible, onConfirm}) => {
    const stopPropagation = useCallback((ev: GestureResponderEvent) => {
      ev.stopPropagation();
    }, []);
    const handleConfirm = useCallback(async () => {
      setVisible(false);
      try {
        await smsReadNotice();
        onConfirm();
      } catch (error) {}
    }, [setVisible, onConfirm]);
    const onClose = useCallback(async () => {
      setVisible(false);
    }, [setVisible]);

    return (
      <Modal animationType="fade" transparent={true} visible={visible}>
        <Touchable style={styles.md_center} activeOpacity={1} onPress={onClose}>
          <Touchable
            style={styles.m_con}
            activeOpacity={1}
            onPress={stopPropagation}>
            <Text style={styles.mc_tip}>确认将全部消息标记为已读？</Text>
            <View style={styles.mc_foo}>
              <Touchable
                style={[styles.mcf_s, styles.md_cancel]}
                onPress={onClose}>
                <Text style={[styles.mf_s_t, styles.mf_s_t_primary]}>取消</Text>
              </Touchable>
              <Touchable
                style={[styles.mcf_s, styles.mcf_s_primary]}
                onPress={handleConfirm}>
                <Text style={[styles.mf_s_t, styles.c_fff]}>确定</Text>
              </Touchable>
            </View>
          </Touchable>
        </Touchable>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  md_center: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  m_con: {
    width: 320,
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 21,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  mc_tip: {
    color: '#333333',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
    marginBottom: 28,
  },
  mc_foo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mcf_s: {
    width: 134,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  mcf_s_primary: {
    backgroundColor: themeColor,
  },
  md_cancel: {
    borderColor: '#D59420',
    borderWidth: 0.5,
  },
  mf_s_t: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  mf_s_t_primary: {
    color: themeColor,
  },
  c_fff: {
    color: '#fff',
  },
});

export default ReadAllMsgModal;
