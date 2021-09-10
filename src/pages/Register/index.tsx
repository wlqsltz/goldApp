import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {Field, Formik, FormikContextType} from 'formik';
import * as Yup from 'yup';
import CheckBox from 'react-native-check-box';
import {RootStackNavigation} from '@/navigator/index';
import Input from '@/components/Input';
import {RootState} from '@/models/index';
import Touchable from '@/components/Touchable';
import UnCheckedIcon from '@/assets/image/register/unchecked.png';
import CheckedIcon from '@/assets/image/register/checked.png';
import useCountdown from '@/utils/hooks/useCountdown';
import {toast} from '@/utils/index';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

interface Values {
  mobile: string;
  smsCode: string;
  loginPwd: string;
  reLoginPwd: string;
  inviteCode: string;
}

const initialValues: Values = {
  mobile: '',
  smsCode: '',
  loginPwd: '',
  reLoginPwd: '',
  inviteCode: '',
};

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['user/register'],
);
const selectInitData = createSelector(
  (state: RootState) => state.user,
  user => ({inviteFlag: user.inviteFlag, userProtocol: user.userProtocol}),
);

const Register: React.FC<IProps> = ({navigation}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const {inviteFlag, userProtocol} = useSelector(selectInitData);

  const sendSmsCode = useCallback(
    (mobile: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'C_REG_MOBILE',
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

  // const {remainSeconds, countdown} = useCountdown();
  // const [sending, setSending] = useState(false);
  // const sendSmsCode = useCallback(
  //   async (formContext: FormikContextType<any>) => {
  //     if (remainSeconds > -1) {
  //       // 正在倒计时
  //       return;
  //     }
  //     formContext.validateField('mobile');
  //     formContext.setFieldTouched('mobile', true);
  //     const mobile = formContext.getFieldProps('mobile').value || '';
  //     if (!/^1[2-9]\d{9}$/.test(mobile.trim())) {
  //       // 或者手机号未填写正确
  //       return;
  //     }
  //     setSending(true);
  //     dispatch({
  //       type: 'user/sendSmsCode',
  //       payload: {
  //         bizType: 'C_REG_MOBILE',
  //         mobile,
  //       },
  //       callback: (err: any) => {
  //         setSending(false);
  //         if (!err) {
  //           countdown();
  //         }
  //       },
  //     });
  //   },
  //   [remainSeconds, countdown, dispatch],
  // );
  // const getSmsBtn = useCallback(
  //   (formContext: FormikContextType<any>) => {
  //     const isCountdown = remainSeconds > -1;
  //     return (
  //       <Touchable
  //         disabled={sending || isCountdown}
  //         style={[styles.sms_btn, isCountdown && styles.sms_btn_disabled]}
  //         onPress={() => sendSmsCode(formContext)}>
  //         {sending ? (
  //           <ActivityIndicator size="small" color={themeColor} />
  //         ) : (
  //           <Text
  //             style={[
  //               styles.sms_btn_txt,
  //               isCountdown && styles.sms_btn_txt_disabled,
  //             ]}>
  //             {isCountdown ? `(${remainSeconds})s` : '获取验证码'}
  //           </Text>
  //         )}
  //       </Touchable>
  //     );
  //   },
  //   [remainSeconds, sendSmsCode, sending],
  // );

  // 是否勾选注册协议
  const [checked, setChecked] = useState(true);
  // 注册
  const onSubmit = useCallback(
    (values: Values) => {
      if (!checked) {
        return toast('请先同意用户协议及隐私条款');
      }
      dispatch({
        type: 'user/register',
        payload: values,
        callback: () => {
          toast('注册成功，将自动为您登录');
        },
      });
    },
    [dispatch, checked],
  );

  useEffect(() => {
    dispatch({
      type: 'user/registerInit',
    });
  }, [dispatch]);

  // 进入用户协议页面
  const goUserProtocol = useCallback(() => {
    navigation.navigate('CommonDetail', {
      title: '用户协议及隐私条款',
      content: userProtocol?.content || '',
    });
  }, [navigation, userProtocol]);

  const validationSchema = useMemo(() => {
    const config: Record<string, any> = {
      mobile: Yup.string()
        .trim()
        .required('请输入手机号码')
        .matches(/^1[2-9]\d{9}$/, '手机号码格式错误'),
      smsCode: Yup.string()
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
    };
    inviteFlag &&
      (config.inviteCode = Yup.string().trim().required('请输入邀请码'));
    return Yup.object().shape(config);
  }, [inviteFlag]);

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
                <Text style={styles.head}>注册</Text>
                <Field
                  name="mobile"
                  placeholder="请输入手机号码"
                  prefix={<Text style={styles.tag}>+86</Text>}
                  component={Input}
                />
                <Field
                  name="smsCode"
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
                <Field
                  name="inviteCode"
                  placeholder={`邀请码（${inviteFlag ? '必填' : '选填'}）`}
                  component={Input}
                  secureTextEntry
                />
                <View style={styles.agree_box}>
                  <CheckBox
                    onClick={() => {
                      setChecked(isChecked => !isChecked);
                    }}
                    isChecked={checked}
                    rightTextView={
                      <Text style={styles.agree_txt}>我已阅读并同意</Text>
                    }
                    checkedImage={
                      <Image source={CheckedIcon} style={styles.agree_img} />
                    }
                    unCheckedImage={
                      <Image source={UnCheckedIcon} style={styles.agree_img} />
                    }
                  />
                  <Touchable onPress={goUserProtocol}>
                    <Text style={[styles.agree_txt, styles.agree_txt_link]}>
                      《用户协议及隐私条款》
                    </Text>
                  </Touchable>
                </View>
                <Touchable
                  disabled={loading}
                  onPress={handleSubmit}
                  style={styles.btn}>
                  <Text style={styles.btn_txt}>注{'  '}册</Text>
                </Touchable>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
  },
  head: {
    marginTop: 27,
    color: '#333333',
    fontSize: 26,
    lineHeight: 37,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  content: {
    height: 370,
    backgroundColor: '#fff',
  },
  tag: {
    color: '#333',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Medium',
    marginRight: 10,
  },
  agree_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  agree_img: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  agree_txt: {
    color: '#A3A3A3',
    fontSize: 12,
    lineHeight: 17,
  },
  agree_txt_link: {
    color: themeColor,
  },
  btn: {
    marginTop: 35,
    backgroundColor: themeColor,
    borderRadius: 23,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_txt: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
});

export default Register;
