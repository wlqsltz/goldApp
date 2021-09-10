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

let IconClose: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M596.938105 512l316.362106-316.362105a60.065684 60.065684 0 0 0-84.911158-84.965053L512 427.061895 195.637895 110.699789a60.065684 60.065684 0 0 0-84.965053 84.911158L427.061895 512 110.699789 828.362105a60.065684 60.065684 0 0 0 84.911158 84.965053L512 596.938105l316.362105 316.362106a59.877053 59.877053 0 0 0 42.496 17.596631 60.065684 60.065684 0 0 0 42.469053-102.534737L596.938105 512z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconClose.defaultProps = {
  size: 18,
};

IconClose = React.memo ? React.memo(IconClose) : IconClose;

export default IconClose;
