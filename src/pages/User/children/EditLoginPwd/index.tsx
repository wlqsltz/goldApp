import React, {useCallback} from 'react';
import {View, Text, ScrollView, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import {RouteProp} from '@react-navigation/native';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import Input from '@/components/Input';
import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import useCountdown from '@/utils/hooks/useCountdown';
import {toast} from '@/utils/index';
import {styles} from '@/pages/Register';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'EditMobile'>;
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

const EditLoginPwd: React.FC<IProps> = ({navigation, route}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const {mobile} = route.params;

  const sendSmsCode = useCallback(
    (mb: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'FORGET_LOGINPWD',
          mobile: mb,
        },
        callback: (err?: any) => {
          callback(err);
        },
      });
    },
    [dispatch],
  );
  const {getSmsBtn} = useCountdown('mobile', sendSmsCode, mobile);

  // 找回密码
  const onSubmit = useCallback(
    (values: Values) => {
      dispatch({
        type: 'user/editLoginPwd',
        payload: values,
        callback: () => {
          toast('修改密码成功');
          setTimeout(() => {
            dispatch({
              type: 'user/logout',
            });
          }, 200);
        },
      });
    },
    [dispatch],
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
              <>
                <Field
                  name="mobile"
                  placeholder="请输入手机号码"
                  prefix={<Text style={styles.tag}>+86</Text>}
                  component={Input}
                  value={mobile}
                  editable={false}
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
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </>
  );
};

export default EditLoginPwd;
