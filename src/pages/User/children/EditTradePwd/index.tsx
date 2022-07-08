import React, {useCallback, useEffect} from 'react';
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
  route: RouteProp<RootStackParamList, 'EditTradePwd'>;
}

interface Values {
  mobile: string;
  smsCaptcha: string;
  tradePwd: string;
  reTradePwd: string;
}

const initialValues: Values = {
  mobile: '',
  smsCaptcha: '',
  tradePwd: '',
  reTradePwd: '',
};

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['user/editTradePwd'],
);

const validationSchema = Yup.object().shape({
  smsCaptcha: Yup.string()
    .trim()
    .required('请输入验证码')
    .matches(/^\d{4}$/, '验证码格式错误'),
  tradePwd: Yup.string()
    .trim()
    .required('请输入密码')
    .matches(/^\d{6}$/, '请填写6位数字的密码'),
  reTradePwd: Yup.string()
    .trim()
    .required('请输入密码')
    .oneOf([Yup.ref('tradePwd')], '密码不一致, 请确认'),
});

const EditTradePwd: React.FC<IProps> = ({navigation, route}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const {mobile, pwdFlag} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: pwdFlag ? '修改交易密码' : '设置交易密码',
    });
  }, [navigation, pwdFlag]);

  const sendSmsCode = useCallback(
    (mb: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'BIND_TRADEPWD',
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
        type: 'user/editTradePwd',
        payload: {
          pwdFlag,
          ...values,
        },
        callback: () => {
          toast(pwdFlag ? '设置交易密码成功' : '修改交易密码成功');
          setTimeout(() => navigation.goBack(), 200);
        },
      });
    },
    [dispatch, navigation, pwdFlag],
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
                  keyboardType="phone-pad"
                  placeholder="请输入手机号码"
                  prefix={<Text style={styles.tag}>+86</Text>}
                  component={Input}
                  value={mobile}
                  editable={false}
                />
                <Field
                  name="smsCaptcha"
                  placeholder="请输入验证码"
                  keyboardType="number-pad"
                  suffix={getSmsBtn}
                  component={Input}
                />
                <Field
                  name="tradePwd"
                  keyboardType="number-pad"
                  placeholder="请输入交易密码(6位数字组成）"
                  component={Input}
                  secureTextEntry
                />
                <Field
                  name="reTradePwd"
                  keyboardType="number-pad"
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

export default EditTradePwd;
