import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {RootStackNavigation} from '@/navigator/index';

interface IProps {
  navigation: RootStackNavigation;
}

const themeColor = '#D59420';

const Withdrawal: React.FC<IProps> = ({navigation, route}) => {
  return <Text>Withdrawal</Text>;
};

const styles = StyleSheet.create({});

export default Withdrawal;
