import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import Touchable from '@/components/Touchable';
import IconFont from '@/assets/iconfont';
import {themeColor, toast} from '@/utils/index';
import GlobalStyles from '@/assets/style/global';
import {IXstrategy} from '@/models/strategy';
import {xstrategyCycleSetStop} from '@/api/trade';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  list: IXstrategy[];
  onConfirm: () => void;
}

const BatchStopModal: React.FC<IProps> = React.memo(
  ({visible, setVisible, list, onConfirm}) => {
    const [stopRate, setStopRate] = useState('');
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
      if (!stopRate) {
        return toast('请填写止损率');
      }
      for (let i = 0, len = list.length; i < len; i++) {
        const {plAmountRate, symbol, toSymbol} = list[i];
        if (+plAmountRate < 0 && Math.abs(+plAmountRate) > +stopRate) {
          return toast(
            `您的 ${symbol}/${toSymbol} 盈亏率大于当前止损率，设置失败！`,
          );
        }
      }
      try {
        setLoading(true);
        xstrategyCycleSetStop({
          idList: list.map(item => item.id),
          stopRatio: stopRate,
        });
        setVisible(false);
        onConfirm();
      } catch (error) {}
      setLoading(false);
    }, [stopRate, list, setVisible, onConfirm]);

    useEffect(() => {
      if (list.length === 1) {
        setStopRate(list[0].stopRate ?? '');
      } else {
        setStopRate('');
      }
    }, [list]);

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
                <Text style={styles.head}>止损设置</Text>
              </View>
              <Touchable
                style={styles.close_box}
                activeOpacity={1}
                onPress={closeModal}>
                <IconFont name="icon-close" size={20} color="#BFBFBF" />
              </Touchable>
              <Text style={styles.tip}>仅针对以下币对进行设置：</Text>
              <View style={styles.symbol_box}>
                {list.map(item => (
                  <Text style={styles.symbol}>
                    {item.symbol}/{item.toSymbol}
                  </Text>
                ))}
              </View>
              <View style={[GlobalStyles.flex_row, styles.input_box]}>
                <TextInput
                  placeholder="请输入止损率"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setStopRate}
                  value={stopRate}
                  style={styles.input}
                />
                <Text style={styles.input_suffix}>%</Text>
              </View>
              <Text style={styles.tip}>
                仓位浮动亏损率达到止损率，系统将自动市价清仓，请谨慎设置。
              </Text>
              <Touchable
                disabled={loading}
                onPress={handleSubmit}
                style={styles.btn}>
                <Text style={styles.btn_txt}>确认设置</Text>
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
    marginBottom: 15,
  },
  head: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 25,
  },
  close_box: {
    width: 29,
    height: 29,
    position: 'absolute',
    top: 17,
    right: 15,
  },
  tip: {
    paddingTop: 13,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
  symbol_box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  symbol: {
    marginRight: 13,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: themeColor,
    lineHeight: 19,
  },
  input_box: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingRight: 15,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  input_suffix: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 21,
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

export default BatchStopModal;
