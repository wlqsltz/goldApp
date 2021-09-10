import React from 'react';
import Touchable from '@/components/Touchable';
import {FormikContextType} from 'formik';
import {useCallback, useRef, useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';

const themeColor = '#D59420';

function useCountdown(
  name: string,
  send: (mobile: string, callback: (err?: any) => void) => void,
  fixedMobile?: string,
) {
  const [remainSeconds, setRemainSeconds] = useState(-1);
  const interval = useRef<NodeJS.Timer>();

  const clear = useCallback(() => {
    interval.current && clearInterval(interval.current);
  }, []);

  const countdown = useCallback(() => {
    let second = 60;
    clear();
    setRemainSeconds(second);
    interval.current = setInterval(() => {
      if (second < 0) {
        clear();
      }
      setRemainSeconds(--second);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return clear;
  }, [clear]);

  const [sending, setSending] = useState(false);
  const sendSmsCode = useCallback(
    async (formContext: FormikContextType<any>) => {
      if (remainSeconds > -1) {
        // 正在倒计时
        return;
      }
      let _mobile = fixedMobile ?? '';
      if (!_mobile) {
        formContext.validateField(name);
        formContext.setFieldTouched(name, true);
        _mobile = formContext.getFieldProps(name).value || '';
        if (!/^1[2-9]\d{9}$/.test(_mobile.trim())) {
          // 或者手机号未填写正确
          return;
        }
      }
      setSending(true);
      send(_mobile, (err?: any) => {
        setSending(false);
        if (!err) {
          countdown();
        }
      });
    },
    [remainSeconds, fixedMobile, send, name, countdown],
  );
  const getSmsBtn = useCallback(
    (formContext: FormikContextType<any>) => {
      const isCountdown = remainSeconds > -1;
      return (
        <Touchable
          disabled={sending || isCountdown}
          style={[styles.sms_btn, isCountdown && styles.sms_btn_disabled]}
          onPress={() => sendSmsCode(formContext)}>
          {sending ? (
            <ActivityIndicator size="small" color={themeColor} />
          ) : (
            <Text
              style={[
                styles.sms_btn_txt,
                isCountdown && styles.sms_btn_txt_disabled,
              ]}>
              {isCountdown ? `(${remainSeconds})s` : '获取验证码'}
            </Text>
          )}
        </Touchable>
      );
    },
    [remainSeconds, sendSmsCode, sending],
  );

  return {
    getSmsBtn,
  };
}

const styles = StyleSheet.create({
  sms_btn: {
    width: 105,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: themeColor,
    borderRadius: 17,
  },
  sms_btn_disabled: {
    backgroundColor: '#ccc',
    borderWidth: 0,
  },
  sms_btn_txt: {
    color: themeColor,
    fontSize: 14,
    lineHeight: 25,
    fontFamily: 'PingFangSC-Regular',
  },
  sms_btn_txt_disabled: {
    color: '#fff',
  },
});

export default useCountdown;
