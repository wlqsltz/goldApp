import React, {useCallback, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import Touchable from '@/components/Touchable';
import IconFont from '@/assets/iconfont';
import {toast} from '@/utils/index';
import {IXstrategy} from '@/models/strategy';
import {xstrategyClearList} from '@/api/trade';

const themeColor = '#D59420';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  list: IXstrategy[];
  onConfirm: () => void;
}

const ClearModal: React.FC<IProps> = React.memo(
  ({visible, setVisible, list, onConfirm}) => {
    // 关闭弹窗
    const closeModal = useCallback(() => {
      setVisible(false);
    }, [setVisible]);
    const stopPropagation = useCallback((ev: GestureResponderEvent) => {
      ev.stopPropagation();
    }, []);
    const [loading, setLoading] = useState(false);
    const handleSubmit = useCallback(async () => {
      if (!list.length) {
        return toast('您还未选择币对');
      }
      try {
        setLoading(true);
        xstrategyClearList({
          idList: list.map(item => item.id),
        });
        setVisible(false);
        onConfirm();
      } catch (error) {}
      setLoading(false);
    }, [list, setVisible, onConfirm]);

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
                <IconFont name="icon-tip" size={54} color={themeColor} />
              </View>
              <Touchable
                style={styles.close_box}
                activeOpacity={1}
                onPress={closeModal}>
                <IconFont name="icon-close" size={20} color="#BFBFBF" />
              </Touchable>
              <Text style={styles.title}>确认市价清仓当前仓位？</Text>
              <Text style={styles.tip}>
                清仓后，策略的当前仓位将一次性市价卖出。
              </Text>
              <Touchable
                disabled={loading}
                onPress={handleSubmit}
                style={styles.btn}>
                <Text style={styles.btn_txt}>确认清仓</Text>
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
    paddingTop: 16,
    paddingBottom: 18,
    position: 'relative',
  },
  head_box: {
    alignItems: 'center',
  },
  title: {
    marginTop: 14,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 25,
    textAlign: 'center',
  },
  close_box: {
    width: 29,
    height: 29,
    position: 'absolute',
    top: 17,
    right: 15,
  },
  tip: {
    paddingTop: 10,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    textAlign: 'center',
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

export default ClearModal;
