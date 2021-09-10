import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Text, ScrollView, StatusBar, StyleSheet, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {Field, Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {RouteProp} from '@react-navigation/native';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import Input from '@/components/Input';
import {RootState} from '@/models/index';
import Touchable from '@/components/Touchable';
import useCountdown from '@/utils/hooks/useCountdown';
import {toast} from '@/utils/index';
import {styles} from '@/pages/Register';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'EditMobile'>;
}

interface Values {
  mobile: string;
  smsCaptchaOld: string;
  newMobile: string;
  smsCaptchaNew: string;
}

const initialValues: Values = {
  mobile: '',
  smsCaptchaOld: '',
  newMobile: '',
  smsCaptchaNew: '',
};

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['user/editMobile'],
);

const EditMobile: React.FC<IProps> = ({navigation, route}) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const {mobile} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: mobile ? '修改手机号' : '绑定手机号',
    });
  }, [mobile, navigation]);

  const validationSchema = useMemo(() => {
    const config: Record<string, any> = {
      newMobile: Yup.string()
        .trim()
        .required('请输入手机号码')
        .matches(/^1[2-9]\d{9}$/, '手机号码格式错误'),
      smsCaptchaNew: Yup.string()
        .trim()
        .required('请输入验证码')
        .matches(/^\d{4}$/, '验证码格式错误'),
    };
    if (mobile) {
      config.smsCaptchaOld = Yup.string()
        .trim()
        .required('请输入验证码')
        .matches(/^\d{4}$/, '验证码格式错误');
    }
    return Yup.object().shape(config);
  }, [mobile]);

  const sendSmsCode = useCallback(
    (mb: string, callback: (err?: any) => void) => {
      dispatch({
        type: 'user/sendSmsCode',
        payload: {
          bizType: 'MODIFY_MOBILE',
          mobile: mb,
        },
        callback: (err?: any) => {
          callback(err);
        },
      });
    },
    [dispatch],
  );
  const {getSmsBtn: getOldSmsBtn} = useCountdown('mobile', sendSmsCode, mobile);
  const {getSmsBtn: getNewSmsBtn} = useCountdown('newMobile', sendSmsCode);

  // 注册
  const onSubmit = useCallback(
    (values: Values) => {
      if (values.mobile === values.newMobile) {
        toast('新手机号不能与旧手机号相同！');
        return;
      }
      dispatch({
        type: 'user/editMobile',
        payload: {
          newMobile: values.newMobile,
          smsCaptchaOld: values.smsCaptchaOld,
          smsCaptchaNew: values.smsCaptchaNew,
        },
        callback: () => {
          toast(`手机号${mobile ? '修改' : '绑定'}成功`);
          setTimeout(() => navigation.goBack(), 200);
        },
      });
    },
    [dispatch, mobile, navigation],
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={pageStyles.container}
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
                {mobile ? (
                  <>
                    <Field
                      name="mobile"
                      placeholder="请输入原手机号码"
                      prefix={<Text style={styles.tag}>+86</Text>}
                      component={Input}
                      value={mobile}
                      editable={false}
                    />
                    <Field
                      name="smsCaptchaOld"
                      placeholder="请输入验证码"
                      suffix={getOldSmsBtn}
                      component={Input}
                    />
                  </>
                ) : null}
                <Field
                  name="newMobile"
                  placeholder={`请输入${mobile ? '新' : ''}手机号码`}
                  prefix={<Text style={styles.tag}>+86</Text>}
                  component={Input}
                />
                <Field
                  name="smsCaptchaNew"
                  placeholder="请输入验证码"
                  suffix={getNewSmsBtn}
                  component={Input}
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

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});

export default EditMobile;
