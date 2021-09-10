import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {throttle} from 'lodash';

export type TouchableProps = TouchableOpacityProps & {
  ms?: number;
};

const Touchable: React.FC<TouchableProps> = React.memo(
  ({style, onPress, ms = 1000, ...rest}) => {
    const touchableStyle = rest.disabled ? [style, styles.disabled] : style;
    let throttleOnPress = useMemo(() => {
      return throttle(
        (event: GestureResponderEvent) => {
          if (typeof onPress === 'function') {
            onPress(event);
          }
        },
        ms,
        {leading: true, trailing: false},
      );
    }, [onPress, ms]);
    return (
      <TouchableOpacity
        onPress={throttleOnPress}
        style={touchableStyle}
        activeOpacity={0.9}
        {...rest}
      />
    );
  },
);

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default Touchable;
