import React, {useMemo, useState, useCallback} from 'react';
import {StyleSheet, Animated, ViewStyle, LayoutChangeEvent} from 'react-native';

interface IProps {
  style?: ViewStyle;
  stickyHeaderY?: number;
  stickyScrollY?: Animated.Value;
  forwardedRef?: ((instance: any) => void) | React.MutableRefObject<any>;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const StickyHeader: React.FC<IProps> = React.memo(props => {
  const {
    stickyHeaderY = -1,
    stickyScrollY = new Animated.Value(0),
    children,
    style,
    forwardedRef,
    onLayout,
    ...otherProps
  } = props;

  const [stickyLayoutY, setStickyLayoutY] = useState(0);

  const _onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (event && event.nativeEvent) {
        setStickyLayoutY(event.nativeEvent.layout.y);
      }
      onLayout && onLayout(event);
    },
    [onLayout],
  );

  const translateY = useMemo(() => {
    const y = stickyHeaderY !== -1 ? stickyHeaderY : stickyLayoutY;
    return stickyScrollY.interpolate({
      inputRange: [-1, 0, y, y + 1],
      outputRange: [0, 0, 0, 1],
    });
  }, [stickyHeaderY, stickyLayoutY, stickyScrollY]);

  return (
    <Animated.View
      ref={forwardedRef}
      onLayout={_onLayout}
      style={[style, styles.container, {transform: [{translateY}]}]}
      {...otherProps}>
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
});

export default StickyHeader;
