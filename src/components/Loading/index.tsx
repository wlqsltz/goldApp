import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

const themeColor = '#D59420';

interface Props {
  title?: string;
  size?: ActivityIndicatorProps['size'];
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  indicatorStyle?: ActivityIndicatorProps['style'];
}

export default function Loading(props: Props) {
  const {
    title = '正在加载中...',
    size = 'small',
    containerStyle,
    textStyle,
    indicatorStyle,
  } = props;
  return (
    <View style={[styled.loadBox, containerStyle]}>
      <ActivityIndicator
        style={[styled.indicator, indicatorStyle]}
        animating={true}
        size={size}
        color={themeColor}
      />
      {title ? <Text style={[styled.loadText, textStyle]}>{title}</Text> : null}
    </View>
  );
}

const styled = StyleSheet.create({
  loadBox: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    marginRight: 4,
  },
  loadText: {
    fontSize: 14,
    color: themeColor,
  },
});
