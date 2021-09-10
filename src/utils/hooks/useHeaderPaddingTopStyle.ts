import {useMemo} from 'react';
import {useHeaderHeight} from '@react-navigation/stack';

export default function useHeaderPaddingTopStyle(padTop = 0) {
  const headerHeight = useHeaderHeight();
  const padTopStyle = useMemo(
    () => ({paddingTop: headerHeight + padTop}),
    [headerHeight, padTop],
  );
  return padTopStyle;
}
