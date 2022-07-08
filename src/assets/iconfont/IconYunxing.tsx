/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

let IconYunxing: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M853.333333 0a170.666667 170.666667 0 0 1 170.666667 170.666667v682.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H170.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V170.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h682.666666zM256 384a42.666667 42.666667 0 0 0-42.666667 42.666667v298.666666a42.666667 42.666667 0 1 0 85.333334 0v-298.666666a42.666667 42.666667 0 0 0-42.666667-42.666667z m256-128a42.666667 42.666667 0 0 0-42.666667 42.666667v426.666666a42.666667 42.666667 0 1 0 85.333334 0V298.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z m256 170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v256a42.666667 42.666667 0 1 0 85.333334 0v-256a42.666667 42.666667 0 0 0-42.666667-42.666666z"
        fill={getIconColor(color, 0, '#2BAD6F')}
      />
    </Svg>
  );
};

IconYunxing.defaultProps = {
  size: 18,
};

IconYunxing = React.memo ? React.memo(IconYunxing) : IconYunxing;

export default IconYunxing;
