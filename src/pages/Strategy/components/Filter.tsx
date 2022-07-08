import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {SCREEN_WIDTH, themeColor} from '@/utils/index';
import {RootState} from '@/models/index';
import {IOptions} from '@/models/strategy';

const itemWidth = (SCREEN_WIDTH - 120) / 2;
const btnWidth = (SCREEN_WIDTH - 115) / 2;

interface IProps {
  open: boolean;
  options: IOptions;
  onCancel: () => void;
  onConfirm: (options: IOptions) => void;
}

const Filter: React.FC<IProps> = ({open, options, onCancel, onConfirm}) => {
  const [_options, setOptions] = useState<IOptions>({
    type: '',
    status: '',
    minAmount: '',
    maxAmount: '',
  });

  const prevOpen = useRef<boolean>();
  useEffect(() => {
    if (prevOpen.current !== open && open) {
      setOptions(options);
    }
    prevOpen.current = open;
  }, [open, options]);

  const handleConfirm = useCallback(() => {
    onConfirm(_options);
  }, [_options, onConfirm]);

  const handleChange = useCallback((key: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>筛选</Text>
      <Text style={styles.sub_title}>策略类型</Text>
      <View style={[GlobalStyles.flex_row, GlobalStyles.flex_jc_sb]}>
        <Touchable
          onPress={() => handleChange('type', '0')}
          ms={100}
          style={[styles.item, _options.type === '0' && styles.item_active]}>
          <Text
            style={[
              styles.item_txt,
              _options.type === '0' && styles.item_txt_active,
            ]}>
            单次策略
          </Text>
        </Touchable>
        <Touchable
          onPress={() => handleChange('type', '1')}
          ms={100}
          style={[styles.item, _options.type === '1' && styles.item_active]}>
          <Text
            style={[
              styles.item_txt,
              _options.type === '1' && styles.item_txt_active,
            ]}>
            循环策略
          </Text>
        </Touchable>
      </View>
      <Text style={styles.sub_title}>策略状态</Text>
      <View style={[GlobalStyles.flex_row, GlobalStyles.flex_jc_sb]}>
        <Touchable
          onPress={() => handleChange('status', '1')}
          ms={100}
          style={[styles.item, _options.status === '1' && styles.item_active]}>
          <Text
            style={[
              styles.item_txt,
              _options.status === '1' && styles.item_txt_active,
            ]}>
            正在进行中
          </Text>
        </Touchable>
        <Touchable
          onPress={() => handleChange('status', '22')}
          ms={100}
          style={[styles.item, _options.status === '22' && styles.item_active]}>
          <Text
            style={[
              styles.item_txt,
              _options.status === '22' && styles.item_txt_active,
            ]}>
            欠费终止
          </Text>
        </Touchable>
      </View>
      <Text style={styles.sub_title}>持仓金额</Text>
      <View style={[GlobalStyles.flex_row, GlobalStyles.flex_jc_sb]}>
        <View style={styles.item_input}>
          <TextInput
            placeholder="请输入金额"
            placeholderTextColor="#A8ACBB"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={value => handleChange('minAmount', value)}
            value={_options.minAmount}
            style={styles.input}
          />
        </View>
        <Text style={styles.line}>～</Text>
        <View style={styles.item_input}>
          <TextInput
            placeholder="请输入金额"
            placeholderTextColor="#A8ACBB"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={value => handleChange('maxAmount', value)}
            value={_options.maxAmount}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <Touchable onPress={onCancel} style={styles.btn}>
          <Text style={styles.btn_txt}>重置</Text>
        </Touchable>
        <Touchable
          onPress={handleConfirm}
          style={[styles.btn, styles.btn_primary]}>
          <Text style={[styles.btn_txt, styles.btn_txt_primary]}>确认</Text>
        </Touchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 29 + getStatusBarHeight(),
    paddingHorizontal: 15,
  },
  title: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
    marginBottom: 7,
  },
  sub_title: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Medium',
    marginTop: 20,
    marginBottom: 17,
  },
  item: {
    height: 37,
    width: itemWidth,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#979797',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_active: {
    borderColor: themeColor,
  },
  item_txt: {
    color: '#A8ACBB',
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
  },
  item_txt_active: {
    color: themeColor,
  },
  item_input: {
    height: 37,
    width: itemWidth,
    backgroundColor: '#F7F7F7',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: itemWidth - 30,
    textAlign: 'center',
    color: '#6A6E7D',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
  line: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#A8ACBB',
  },
  bottom: {
    position: 'absolute',
    bottom: 35,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    height: 50,
    width: btnWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E9ED',
    borderRadius: 4,
  },
  btn_primary: {
    backgroundColor: themeColor,
  },
  btn_txt: {
    color: '#A8ACBB',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  btn_txt_primary: {
    color: '#fff',
  },
});

export default Filter;
