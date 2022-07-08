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

let IconTipSquare: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M853.333333 0a170.666667 170.666667 0 0 1 170.666667 170.666667v682.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H170.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V170.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h682.666666z m-341.333333 725.333333a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m10.666667-512C493.226667 213.333333 469.333333 232.448 469.333333 256v341.333333c0 23.552 23.893333 42.666667 53.333334 42.666667s53.333333-19.114667 53.333333-42.666667V256c0-23.552-23.893333-42.666667-53.333333-42.666667z"
        fill={getIconColor(color, 0, '#D59420')}
      />
    </Svg>
  );
};

IconTipSquare.defaultProps = {
  size: 18,
};

IconTipSquare = React.memo ? React.memo(IconTipSquare) : IconTipSquare;

export default IconTipSquare;
