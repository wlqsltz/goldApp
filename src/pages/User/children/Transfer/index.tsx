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
import {useDispatch} from 'react-redux';
import {Field, Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {RootStackNavigation} from '@/navigator/index';
import Touchable from '@/components/Touchable';
import GlobalStyles from '@/assets/style/global';
import Input from '@/components/Input';
import useCountdown from '@/utils/hooks/useCountdown';
import {ampHundred, splitLineStr, toast} from '@/utils/index';
import {transferOrder, withdrawRuleFee} from '@/api/trade';
import {accountDetailByUser} from '@/api/user';
import {styles, IRule} from '../Withdrawal';
import Picker from '@/components/Picker';

interface IProps {
  navigation: RootStackNavigation;
}
interface Values {
  amount: string;
  toMobile: string;
  tradePwd: string;
  smsCode: string;
  kind: string;
}

const initialValues: Values = {
  amount: '',
  toMobile: '',
  tradePwd: '',
  smsCode: '',
  kind: 'C',
};
const kindList = [
  {key: 'C', value: '小圈子'},
  {key: 'CPS', value: '操盘手'},
];

const validationSchema = Yup.object().shape({
  kind: Yup.string().trim().required('请选择用户类型'),
  amount: Yup.string()
    .trim()
    .required('请输入转出数量')
    .matches(/^\d+(\.\d+)?$/, '转出数量必须为数字'),
  toMobile: Yup.string()
    .trim()
    .required('请输入接收人手机号码')
    .matches(/^1[2-9]\d{9}$/, '手机号码格式错误'),
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

const Transfer: React.FC<IProps> = ({navigation}) => {
  const [accountData, setAccountData] = useState<IAccount>();
  const [rule, setRule] = useState<IRule>({} as IRule);
  const [refreshing, setRefreshing] = useState(false);
  // 账户信息
  const getUserAccount = useCallback(() => {
    withdrawRuleFee({currency: 'USDT', type: 'transfer'}).then((d: any) => {
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

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const sendSmsCode = useCallback(
    (mobile: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'TRANSFER',
          mobile,
        },
        callback: (err?: any) => {
          callback(err);
        },
      });
    },
    [dispatch],
  );
  const {getSmsBtn} = useCountdown('toMobile', sendSmsCode);

  const onSubmit = useCallback(
    async (values: Values) => {
      setLoading(true);
      try {
        await transferOrder({
          ...values,
          currency: 'USDT',
        });
        toast('转账成功');
        setTimeout(() => navigation.goBack(), 200);
      } catch (error) {
        setLoading(false);
      }
    },
    [navigation],
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
                  type: '2',
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
                    <Text style={styles.item_label}>用户类型</Text>
                  </View>
                  <Field
                    name="kind"
                    keyboardType="phone-pad"
                    placeholder="请选择用户类型"
                    containerStyle={styles.container_style}
                    list={kindList}
                    component={Picker}
                  />
                  <View style={[GlobalStyles.flex_row, styles.item_title]}>
                    <Text style={styles.item_label}>转出数量</Text>
                    <Text style={styles.item_label_suffix}>
                      可用余额：{accountData?.availableAmount ?? '--'} USDT
                    </Text>
                  </View>
                  <Field
                    name="amount"
                    keyboardType="numeric"
                    placeholder="请输入转出数量"
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
                    <Text style={styles.item_label}>接收人手机号</Text>
                  </View>
                  <Field
                    name="toMobile"
                    keyboardType="phone-pad"
                    placeholder="请输入接收人手机号"
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
                  <Text style={styles.rule_title}>转账规则</Text>
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
                  <Text style={styles.btn_txt}>确认</Text>
                </Touchable>
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

const pageStyles = StyleSheet.create({});

export default Transfer;
