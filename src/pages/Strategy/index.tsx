import React from 'react';
import {View, Text} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';

interface IProps {
  navigation: RootStackNavigation;
}

const Strategy: React.FC<IProps> = ({navigation}) => {
  return (
    <View>
      <Text>Strategy Page</Text>
    </View>
  );
};

export default Strategy;
