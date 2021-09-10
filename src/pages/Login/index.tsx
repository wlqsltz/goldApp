import React, {useCallback} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import Input from '@/components/Input';
import LogoIcon from '@/assets/image/logo_sign.png';
import LoginBg from '@/assets/image/login/login_bg.png';
import {RootStackNavigation} from '@/navigator/index';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

interface Values {
  loginName: string;
  loginPwd: string;
}

const initialValues: Values = {
  loginName: '',
  loginPwd: '',
};

const validationSchema = Yup.object().shape({
  loginName: Yup.string()
    .trim()
    .required('请输入手机号码')
    .length(11, '手机号码格式错误'),
  loginPwd: Yup.string().trim().required('请输入密码'),
});

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['user/login'],
);

const Login: React.FC<IProps> = ({navigation}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values: Values) => {
      dispatch({
        type: 'user/login',
        payload: values,
      });
    },
    [dispatch],
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <ImageBackground style={styles.login_bg} source={LoginBg}>
          <Image style={styles.logo} source={LogoIcon} />
        </ImageBackground>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}>
          {({handleSubmit}) => {
            return (
              <View style={styles.content}>
                <Text style={styles.head}>欢迎回来</Text>
                <Field
                  name="loginName"
                  placeholder="请输入手机号码"
                  keyboardType="numeric"
                  component={Input}
                />
                <Field
                  name="loginPwd"
                  placeholder="请输入密码"
                  component={Input}
                  secureTextEntry
                />
                <Touchable
                  disabled={loading}
                  onPress={handleSubmit}
                  style={styles.btn}>
                  <Text style={styles.btn_txt}>登{'  '}录</Text>
                </Touchable>
                <View style={styles.foot}>
                  <Text
                    style={styles.foot_txt}
                    onPress={() => navigation.navigate('Register')}>
                    注册帐号
                  </Text>
                  <Text
                    style={styles.foot_txt}
                    onPress={() => navigation.navigate('ResetPwd')}>
                    忘记密码？
                  </Text>
                </View>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  login_bg: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    resizeMode: 'contain',
  },
  content: {
    marginHorizontal: 15,
    height: 370,
    backgroundColor: '#fff',
    position: 'relative',
    top: -45,
    borderRadius: 8,
    paddingTop: 42,
    paddingBottom: 35,
    paddingHorizontal: 20,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
  },
  head: {
    marginBottom: 10,
    fontSize: 26,
    color: '#2a2a2a',
    lineHeight: 37,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
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
  foot: {
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  foot_txt: {
    fontSize: 14,
    color: '#656565',
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
});

export default Login;
