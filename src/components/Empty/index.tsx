import React from 'react';
import NoTradeIcon from '@/assets/image/no_trade.png';
import {Image, ImageStyle, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';

interface IProps {
  source?: string;
  message?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Empty: React.FC<IProps> = ({
  source = NoTradeIcon,
  message = '暂无数据～',
  containerStyle,
  imageStyle,
  textStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image style={[styles.image, imageStyle]} source={source} />
      <Text style={[styles.text, textStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    alignItems: 'center',
    paddingBottom: 30,
  },
  image: {
    width: 184,
    height: 90,
  },
  text: {
    color: '#999',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
    marginTop: 15,
  },
});

export default Empty;
