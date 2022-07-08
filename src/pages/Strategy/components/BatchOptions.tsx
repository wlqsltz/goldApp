import GlobalStyles from '@/assets/style/global';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import SettingIcon from '@/assets/image/strategy/setting.png';
import ClearIcon from '@/assets/image/strategy/clear.png';
import StopIcon from '@/assets/image/strategy/stop.png';
import Touchable from '@/components/Touchable';

const themeColor = '#D59420';

interface IProps {
  count: number;
  handleSetting: () => void;
  handleClear: () => void;
}

const BatchOptions: React.FC<IProps> = React.memo(
  ({count, handleSetting, handleClear}) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = useCallback(() => {
      setOpen(prev => !prev);
    }, []);
    const prevCount = useRef<number>();
    useEffect(() => {
      if (prevCount.current === 0 && count > 0) {
        setOpen(false);
      }
      prevCount.current = count;
    }, [count]);

    return (
      <View style={[GlobalStyles.bg_fff, GlobalStyles.ph15, styles.container]}>
        <View
          style={[
            GlobalStyles.flex_row,
            GlobalStyles.flex_jc_sb,
            styles.header,
          ]}>
          <View style={GlobalStyles.flex_row}>
            <View style={styles.line} />
            <Text style={styles.title}>已勾选</Text>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.title}>项</Text>
          </View>
          <Touchable onPress={toggleOpen} ms={100}>
            <Text style={styles.tip}>{open ? '收起' : '批量操作'}</Text>
          </Touchable>
        </View>
        {open ? (
          <View
            style={[
              GlobalStyles.flex_row,
              GlobalStyles.flex_jc_sb,
              styles.options,
            ]}>
            <View style={GlobalStyles.flex_ai_center}>
              <Image style={styles.icon} source={SettingIcon} />
              <Text style={styles.option_txt}>批量设置</Text>
            </View>
            <Touchable
              onPress={handleClear}
              style={GlobalStyles.flex_ai_center}>
              <Image style={styles.icon} source={ClearIcon} />
              <Text style={styles.option_txt}>批量清仓</Text>
            </Touchable>
            <Touchable
              onPress={handleSetting}
              style={GlobalStyles.flex_ai_center}>
              <Image style={styles.icon} source={StopIcon} />
              <Text style={styles.option_txt}>批量止损</Text>
            </Touchable>
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.09)',
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    paddingTop: 16,
    paddingBottom: 13,
  },
  line: {
    width: 2,
    height: 15,
    backgroundColor: themeColor,
    borderRadius: 1,
    marginRight: 6,
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#A8ACBB',
    lineHeight: 20,
  },
  count: {
    paddingHorizontal: 5,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    color: themeColor,
    lineHeight: 23,
  },
  tip: {
    paddingLeft: 4,
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 13,
    fontWeight: 'bold',
    color: themeColor,
    lineHeight: 19,
  },
  options: {
    paddingHorizontal: 23,
    paddingBottom: 13,
  },
  icon: {
    width: 70,
    height: 70,
  },
  option_txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default BatchOptions;
