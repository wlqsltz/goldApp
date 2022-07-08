import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  ScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {Field, Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {RootState} from '@/models/index';
import {createSelector} from 'reselect';
import {RootStackNavigation} from '@/navigator/index';
import Touchable from '@/components/Touchable';
import GlobalStyles from '@/assets/style/global';
import Input from '@/components/Input';
import useCountdown from '@/utils/hooks/useCountdown';
import {ampHundred, splitLineStr, toast} from '@/utils/index';
import IconFont from '@/assets/iconfont';
import {turnOutApply, withdrawRuleFee} from '@/api/trade';
import {accountDetailByUser} from '@/api/user';
import QrCodeCamera from '@/components/QrCodeCamera';

export interface IRule {
  content: string;
  withdrawFee: string;
  withdrawFeeTakeLocation: string;
  withdrawFeeType: string;
  withdrawLimit: string;
  withdrawMin: string;
  withdrawRule: string;
  withdrawStep: string;
}

interface IProps {
  navigation: RootStackNavigation;
}
interface Values {
  amount: string;
  toAddress: string;
  tradePwd: string;
  smsCode: string;
}

const selectUser = createSelector(
  (state: RootState) => state.user,
  user => user.user,
);

const initialValues: Values = {
  amount: '',
  toAddress: '',
  tradePwd: '',
  smsCode: '',
};

const validationSchema = Yup.object().shape({
  amount: Yup.string()
    .trim()
    .required('请输入提币数量')
    .matches(/^\d+(\.\d+)?$/, '提币数量必须为数字'),
  toAddress: Yup.string().trim().required('请输入提币地址'),
  tradePwd: Yup.string()
    .trim()
    .required('请输入交易密码')
    .matches(/^\d{6}$/, '请填写6位数字的密码'),
  smsCode: Yup.string()
    .trim()
    .required('请输入验证码')
    .matches(/^\d{4}$/, '验证码格式错误'),
});

const themeColor = '#D59420';

const Withdrawal: React.FC<IProps> = ({navigation}) => {
  const userInfo = useSelector(selectUser);
  const [accountData, setAccountData] = useState<IAccount>();
  const [rule, setRule] = useState<IRule>({} as IRule);
  const [refreshing, setRefreshing] = useState(false);
  // 账户信息
  const getUserAccount = useCallback(() => {
    withdrawRuleFee({currency: 'USDT', type: 'withdraw'}).then((d: any) => {
      setRule(d);
    });
    accountDetailByUser('USDT')
      .then((res: any) => {
        setAccountData(res);
      })
      .finally(() => setRefreshing(false));
  }, []);

  const formRef = useRef<FormikProps<Values>>(null);
  const handleAll = useCallback(() => {
    if (!formRef.current || !accountData) {
      return;
    }
    formRef.current.setFieldValue('amount', accountData.availableAmount);
  }, [accountData]);

  const [visible, setVisible] = useState(false);
  const showCamera = useCallback(() => {
    setVisible(true);
  }, []);
  const onBarCodeRead = useCallback((text: string) => {
    formRef.current?.setFieldValue('toAddress', text);
  }, []);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const sendSmsCode = useCallback(
    (mobile: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'WITHDRAW',
          mobile,
        },
        callback: (err?: any) => {
          callback(err);
        },
      });
    },
    [dispatch],
  );
  const {getSmsBtn} = useCountdown('mobile', sendSmsCode, userInfo?.mobile);

  const onSubmit = useCallback(
    async (values: Values) => {
      setLoading(true);
      try {
        await turnOutApply({
          ...values,
          accountNumber: accountData?.accountNumber,
        });
        toast('提币成功');
        setTimeout(() => navigation.goBack(), 200);
      } catch (error) {
        setLoading(false);
      }
    },
    [accountData?.accountNumber, navigation],
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserAccount();
  }, [getUserAccount]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      try {
        setRefreshing(true);
        getUserAccount();
        navigation.setOptions({
          headerRight: () => (
            <Touchable
              style={styles.head_right}
              onPress={() =>
                navigation.navigate('TransferOrWithdrawalList', {
                  type: '1',
                })
              }>
              <Text style={styles.head_right_txt}>记录</Text>
            </Touchable>
          ),
        });
      } catch (error) {}
    });

    return () => task.cancel();
  }, [getUserAccount, navigation]);

  return (
    <View style={[GlobalStyles.flex_1, GlobalStyles.bg_f7f7f7]}>
      <StatusBar barStyle="dark-content" />
      <Formik
        innerRef={formRef}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}>
        {({handleSubmit}) => {
          return (
            <View style={GlobalStyles.flex_1}>
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                refreshControl={
                  <RefreshControl
                    colors={[themeColor]}
                    tintColor={themeColor}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                <View style={[GlobalStyles.ph15, GlobalStyles.bg_fff]}>
                  <View style={[GlobalStyles.flex_row, styles.item_title]}>
                    <Text style={styles.item_label}>提币数量</Text>
                    <Text style={styles.item_label_suffix}>
                      可用余额：{accountData?.availableAmount ?? '--'} USDT
                    </Text>
                  </View>
                  <Field
                    name="amount"
                    keyboardType="numeric"
                    placeholder="请输入提币数量"
                    suffix={() => (
                      <Touchable onPress={handleAll} style={styles.all_box}>
                        <Text style={styles.all}>全部</Text>
                      </Touchable>
                    )}
                    containerStyle={styles.container_style}
                    inputStyle={styles.input_style}
                    component={Input}
                  />
                  <Text style={styles.item_tip}>
                    手续费：
                    {rule.withdrawFeeType === '0'
                      ? rule.withdrawFee + 'USDT'
                      : `${ampHundred(rule.withdrawFee) || 0}%`}
                  </Text>
                </View>
                <View
                  style={[
                    GlobalStyles.ph15,
                    GlobalStyles.bg_fff,
                    GlobalStyles.mt10,
                  ]}>
                  <View style={[GlobalStyles.flex_row, styles.item_title]}>
                    <Text style={styles.item_label}>提币地址</Text>
                    <Touchable onPress={showCamera}>
                      <IconFont name="icon-scan" size={18} />
                    </Touchable>
                  </View>
                  <Field
                    name="toAddress"
                    placeholder="请输入提币地址或扫码"
                    containerStyle={styles.container_style}
                    inputStyle={styles.input_style}
                    component={Input}
                  />
                  <View style={[GlobalStyles.flex_row, styles.item_title]}>
                    <Text style={styles.item_label}>交易密码</Text>
                  </View>
                  <Field
                    name="tradePwd"
                    keyboardType="number-pad"
                    placeholder="请输入交易密码"
                    containerStyle={styles.container_style}
                    inputStyle={styles.input_style}
                    component={Input}
                    secureTextEntry
                  />
                  <View style={[GlobalStyles.flex_row, styles.item_title]}>
                    <Text style={styles.item_label}>验证码</Text>
                  </View>
                  <Field
                    name="smsCode"
                    keyboardType="number-pad"
                    placeholder="请输入验证码"
                    containerStyle={styles.container_style}
                    inputStyle={styles.input_style}
                    suffix={getSmsBtn}
                    component={Input}
                  />
                </View>
                <View style={[styles.rule, GlobalStyles.ph15]}>
                  <Text style={styles.rule_title}>提币规则</Text>
                  {splitLineStr(rule.withdrawRule).map((it: any) => (
                    <Text key={it} style={styles.rule_msg}>
                      {it}
                    </Text>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.btn_box}>
                <Touchable
                  disabled={loading}
                  onPress={handleSubmit}
                  style={styles.btn}>
                  <Text style={styles.btn_txt}>确认提币</Text>
                </Touchable>
              </View>
            </View>
          );
        }}
      </Formik>
      <QrCodeCamera
        visible={visible}
        setVisible={setVisible}
        onRead={onBarCodeRead}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  head_right: {
    paddingHorizontal: 15,
  },
  head_right_txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
  },
  list: {
    flex: 1,
  },
  item_title: {
    marginTop: 18,
    justifyContent: 'space-between',
  },
  item_label: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  item_label_suffix: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#AB7007',
    lineHeight: 17,
  },
  container_style: {
    paddingTop: 11,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input_style: {
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
  all_box: {
    paddingLeft: 15,
  },
  all: {
    fontSize: 16,
    lineHeight: 22,
    color: '#D1BD98',
  },
  item_tip: {
    marginTop: 6,
    marginBottom: 10,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#AB7007',
    lineHeight: 20,
  },
  rule: {
    marginTop: 15,
  },
  rule_title: {
    marginBottom: 5,
    color: '#999999',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  rule_msg: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
  },
  btn_box: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: ifIphoneX(30, 10),
    justifyContent: 'center',
    borderColor: '#DFDFDF',
    borderTopWidth: 0.5,
  },
  btn: {
    marginHorizontal: 15,
    height: 48,
    backgroundColor: themeColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_txt: {
    color: '#fff',
    fontSize: 16,
  },
  scanner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Withdrawal;
