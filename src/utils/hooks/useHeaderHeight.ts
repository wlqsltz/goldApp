import {useMemo} from 'react';
import {useHeaderHeight} from '@react-navigation/stack';

export default function useHeaderHeightStyle(height = 0) {
  const headerHeight = useHeaderHeight();
  const heightStyle = useMemo(
    () => ({height: headerHeight + height}),
    [headerHeight, height],
  );
  return heightStyle;
}
