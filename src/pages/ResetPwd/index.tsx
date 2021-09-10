import React, {useCallback} from 'react';
import {View, Text, ScrollView, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import {RootStackNavigation} from '@/navigator/index';
import Input from '@/components/Input';
import {RootState} from '@/models/index';
import Touchable from '@/components/Touchable';
import useCountdown from '@/utils/hooks/useCountdown';
import {toast} from '@/utils/index';
import {styles} from '../Register';

interface IProps {
  navigation: RootStackNavigation;
}

interface Values {
  mobile: string;
  smsCaptcha: string;
  loginPwd: string;
  reLoginPwd: string;
}

const initialValues: Values = {
  mobile: '',
  smsCaptcha: '',
  loginPwd: '',
  reLoginPwd: '',
};

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['user/resetPwd'],
);

const validationSchema = Yup.object().shape({
  mobile: Yup.string()
    .trim()
    .required('请输入手机号码')
    .matches(/^1[2-9]\d{9}$/, '手机号码格式错误'),
  smsCaptcha: Yup.string()
    .trim()
    .required('请输入验证码')
    .matches(/^\d{4}$/, '验证码格式错误'),
  loginPwd: Yup.string()
    .trim()
    .required('请输入密码')
    .matches(
      /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      '请填写6-16位数字和字母组合的密码',
    ),
  reLoginPwd: Yup.string()
    .trim()
    .required('请输入密码')
    .oneOf([Yup.ref('loginPwd')], '密码不一致, 请确认'),
});

const ResetPwd: React.FC<IProps> = ({navigation}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const sendSmsCode = useCallback(
    (mobile: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'FORGET_LOGINPWD',
          mobile,
        },
        callback: (err?: any) => {
          callback(err);
        },
      });
    },
    [dispatch],
  );
  const {getSmsBtn} = useCountdown('mobile', sendSmsCode);

  // 找回密码
  const onSubmit = useCallback(
    (values: Values) => {
      dispatch({
        type: 'user/resetPwd',
        payload: {
          ...values,
          userKind: 'C',
        },
        callback: () => {
          toast('重置密码成功');
          setTimeout(() => navigation.goBack(), 200);
        },
      });
    },
    [dispatch, navigation],
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}>
          {({handleSubmit}) => {
            return (
              <View style={styles.content}>
                <Text style={styles.head}>重置密码</Text>
                <Field
                  name="mobile"
                  placeholder="请输入手机号码"
                  prefix={<Text style={styles.tag}>+86</Text>}
                  component={Input}
                />
                <Field
                  name="smsCaptcha"
                  placeholder="请输入验证码"
                  suffix={getSmsBtn}
                  component={Input}
                />
                <Field
                  name="loginPwd"
                  placeholder="请输入密码(6-16位数字和字母组合）"
                  component={Input}
                  secureTextEntry
                />
                <Field
                  name="reLoginPwd"
                  placeholder="请确认密码"
                  component={Input}
                  secureTextEntry
                />
                <Touchable
                  disabled={loading}
                  onPress={handleSubmit}
                  style={styles.btn}>
                  <Text style={styles.btn_txt}>确{'  '}定</Text>
                </Touchable>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </>
  );
};

export default ResetPwd;
