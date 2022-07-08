import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {RootSiblingParent} from 'react-native-root-siblings';
import {createSelector} from 'reselect';
import {useSelector} from 'react-redux';
import Touchable from '@/components/Touchable';
import IconFont from '@/assets/iconfont';
import {toast} from '@/utils/index';
import {createTg, intentionRecordDetail} from '@/api/message';
import {RootState} from '@/models/index';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  id: string;
  sendSuccess: () => void;
  reApplyId?: string;
}

const selectMobile = createSelector(
  (state: RootState) => state.user,
  user => user.user?.mobile,
);

const ApplyTgModal: React.FC<IProps> = ({
  visible,
  setVisible,
  id,
  sendSuccess,
  reApplyId,
}) => {
  const mobile = useSelector(selectMobile);
  const mobileText = useMemo(() => {
    if (!mobile) {
      return '';
    }
    return mobile.slice(0, 3) + '******' + mobile.slice(mobile.length - 2);
  }, [mobile]);
  // 关闭弹窗
  const closeModal = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const stopPropagation = useCallback((ev: GestureResponderEvent) => {
    ev.stopPropagation();
  }, []);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [entrustAmount, setEntrustAmount] = useState('');
  const [stopRatio, setStopRatio] = useState('');

  // 提交托管意向
  const [fetching, setFetching] = useState(false);
  const submit = useCallback(async () => {
    try {
      if (fetching) {
        return;
      }
      if (!startDate) {
        return toast('请填写开始时间!');
      }
      if (!endDate) {
        return toast('请填写结束时间!');
      }
      if (!entrustAmount) {
        return toast('请填写托管金额!');
      }
      if (!stopRatio) {
        return toast('请填写止损率!');
      }
      setFetching(true);
      await createTg({
        startDate,
        endDate,
        entrustAmount,
        stopRatio,
        mobile,
        operatorId: id,
      });
      setVisible(false);
      sendSuccess();
    } catch (e) {}
    setFetching(false);
  }, [
    fetching,
    startDate,
    endDate,
    entrustAmount,
    stopRatio,
    mobile,
    id,
    sendSuccess,
    setVisible,
  ]);
  useEffect(() => {
    if (reApplyId) {
      intentionRecordDetail(reApplyId).then((res: any) => {
        setStartDate(res.startDate);
        setEndDate(res.endDate);
        setEntrustAmount(res.entrustAmount);
        setStopRatio(res.stopRatio);
      });
    }
  }, [reApplyId]);

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
              <Text style={styles.head}>发送托管意向</Text>
            </View>
            <Touchable
              style={styles.close_box}
              activeOpacity={1}
              onPress={closeModal}>
              <IconFont name="icon-close" size={20} />
            </Touchable>
            <View style={styles.form_item}>
              <Text style={styles.label}>托管时段</Text>
              <View style={[styles.input_box, styles.date_input_box]}>
                <DatePicker
                  date={startDate}
                  locale={'zh-Hans'}
                  mode="date"
                  placeholder="开始时间"
                  format="YYYY-MM-DD"
                  confirmBtnText="确定"
                  cancelBtnText="取消"
                  customStyles={{
                    placeholderText: styles.c_999,
                    dateText: styles.date_text,
                    btnTextConfirm: styles.c_d59420,
                    dateIcon: styles.hidden,
                    dateInput: styles.start_date_input,
                    datePicker: styles.jc,
                  }}
                  onDateChange={setStartDate}
                />
                <View style={styles.line_box}>
                  <View style={styles.line} />
                </View>
                <DatePicker
                  date={endDate}
                  locale={'zh-Hans'}
                  mode="date"
                  placeholder="结束时间"
                  format="YYYY-MM-DD"
                  confirmBtnText="确定"
                  cancelBtnText="取消"
                  customStyles={{
                    placeholderText: styles.c_999,
                    dateText: styles.date_text,
                    btnTextConfirm: styles.c_d59420,
                    dateIcon: styles.hidden,
                    dateInput: styles.end_date_input,
                    datePicker: styles.jc,
                  }}
                  onDateChange={setEndDate}
                />
              </View>
            </View>
            <View style={styles.form_item}>
              <Text style={styles.label}>托管金额</Text>
              <View style={styles.input_box}>
                <TextInput
                  clearTextOnFocus={false}
                  style={styles.input}
                  placeholderTextColor={'#999999'}
                  placeholder={'请输入托管金额'}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setEntrustAmount}
                  value={entrustAmount}
                />
                <Text style={styles.suffix}>USDT</Text>
              </View>
            </View>
            <View style={styles.form_item}>
              <Text style={styles.label}>止损率</Text>
              <View style={styles.input_box}>
                <TextInput
                  clearTextOnFocus={false}
                  style={styles.input}
                  placeholderTextColor={'#999999'}
                  placeholder={'请输入止损率'}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  clearButtonMode={'while-editing'}
                  onChangeText={setStopRatio}
                  value={stopRatio}
                />
                <Text style={styles.suffix}>%</Text>
              </View>
            </View>
            <View style={[styles.form_item, styles.inline_form_item]}>
              <Text style={styles.label}>联系方式</Text>
              <View style={[styles.input_box, styles.readonly_input_box]}>
                <Text style={styles.input_text}>{mobileText}</Text>
              </View>
            </View>
            <Touchable
              disabled={fetching}
              onPress={submit}
              style={[
                styles.button_box,
                fetching ? styles.button_disabled : null,
              ]}>
              <Text style={styles.button}>确定</Text>
            </Touchable>
            <Text style={styles.tip}>最终以双方沟通后结果为准</Text>
          </Touchable>
        </Touchable>
      </RootSiblingParent>
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
    height: 447,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 21,
    paddingTop: 25,
    paddingBottom: 15,
    position: 'relative',
  },
  head_box: {
    alignItems: 'center',
    marginBottom: 2,
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
    top: 28,
    right: 15,
  },
  form_item: {
    marginTop: 17,
  },
  inline_form_item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#696874',
    lineHeight: 19,
  },
  input_box: {
    marginTop: 6,
    height: 43,
    backgroundColor: '#F6F6F6',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  date_input_box: {
    paddingHorizontal: 0,
  },
  readonly_input_box: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 0,
    justifyContent: 'flex-end',
    paddingRight: 0,
    height: 'auto',
  },
  start_date_input: {
    alignItems: 'flex-start',
    marginLeft: 15,
    borderWidth: 0,
  },
  end_date_input: {
    alignItems: 'flex-end',
    marginRight: 15,
    borderWidth: 0,
  },
  line_box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 13,
    borderRadius: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CBCDD1',
  },
  input: {
    flex: 1,
    color: '#333333',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  suffix: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#8F8F92',
    lineHeight: 17,
  },
  input_text: {
    color: '#333333',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  button_box: {
    marginTop: 17,
    height: 44,
    backgroundColor: '#D59420',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_disabled: {
    backgroundColor: '#cccccc',
  },
  button: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
    lineHeight: 23,
  },
  tip: {
    marginTop: 9,
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#696874',
    lineHeight: 19,
    textAlign: 'center',
  },
  hidden: {
    display: 'none',
  },
  jc: {
    justifyContent: 'center',
  },
  c_999: {
    color: '#999999',
  },
  date_text: {
    fontSize: 12,
    color: '#333333',
  },
  c_d59420: {
    color: '#D59420',
  },
});

export default ApplyTgModal;
