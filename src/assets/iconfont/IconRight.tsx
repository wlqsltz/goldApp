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

let IconRight: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M325.048 93.511l-60.030 59.435 357.181 359.631-360.184 356.603 59.522 59.93 420.207-416.043z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconRight.defaultProps = {
  size: 18,
};

IconRight = React.memo ? React.memo(IconRight) : IconRight;

export default IconRight;
