import {Dimensions} from 'react-native';
import Toast, {ToastOptions} from 'react-native-root-toast';
import Clipboard from '@react-native-community/clipboard';
import dayjs from 'dayjs';

export const themeColor = '#D59420';

export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
export function toast(
  message: string,
  options: ToastOptions = {
    position: Toast.positions.CENTER,
    duration: Toast.durations.SHORT,
    shadow: true,
    animation: true,
  },
) {
  Toast.show(message, options);
}

/*
 * 阿里云oss图片-质量处理
 * uri: 图片地址
 * q: 图片质量 0-100
 * r: 图片圆角 1-100
 * */
export function delImgQuality(uri: string, q = 60, r = 1) {
  return `${uri}?x-oss-process=image/format,jpg/interlace,1/quality,q_${q}/rounded-corners,r_${r}`;
}

export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

// 根据百分比获取宽度
export function wp(percentage: number) {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(value);
}

// 根据百分比获取高度
export function hp(percentage: number) {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(value);
}

// 日期时间格式化
export function dateTimeFormat(
  date?: string | number,
  format = 'YYYY-MM-DD HH:mm:ss',
) {
  if (!date) {
    return '';
  }
  return dayjs(+date).format(format);
}

// 日期格式化
export function dateFormat(date?: string | number, format = 'YYYY-MM-DD') {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

// 显示/隐藏 金额
export function showHideMoney(num?: string | number, isShow?: boolean) {
  if (!num) {
    return '--';
  }
  if (isShow) {
    return num.toString();
  } else {
    const len = num.toString().length;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += '*';
    }
    return str;
  }
}

// 手机号*号处理
export function starMobile(str?: string) {
  if (str && str.length > 0) {
    return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return str ?? '';
}

// 放大100倍
export function ampHundred(num: any) {
  num = Number(num);
  if (!isNaN(num)) {
    return (Math.floor(num * 10000) / 100).toFixed(2);
  }
  return 0;
}

// 复制
export async function copyText(text: string, isShow = true) {
  Clipboard.setString(text);
  const str = await Clipboard.getString();
  if (str) {
    isShow && toast('复制成功');
  }
}

// 换行切割
export function splitLineStr(str: string) {
  if (!str) {
    return [];
  }
  return str.split(/[\n\s]/);
}
