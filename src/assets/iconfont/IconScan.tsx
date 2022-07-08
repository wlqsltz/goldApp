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

let IconScan: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M102.4 716.8v204.8h204.8V1024H56.888889a56.888889 56.888889 0 0 1-56.888889-56.888889v-250.311111h102.4z m921.6 0V967.111111a56.888889 56.888889 0 0 1-56.888889 56.888889h-250.311111v-102.4h204.8v-204.8H1024z m-64-268.8v102.4H64v-102.4h896zM307.2 0a51.2 51.2 0 1 1-0.711111 102.4H102.4v204.8H0V56.888889a56.888889 56.888889 0 0 1 56.888889-56.888889zM967.111111 0a56.888889 56.888889 0 0 1 56.888889 56.888889v250.311111h-102.4V102.4h-204.8V0H967.111111z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M716.8 51.2m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 1, '#333333')}
      />
      <Path
        d="M307.2 972.8m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 2, '#333333')}
      />
      <Path
        d="M716.8 972.8m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 3, '#333333')}
      />
      <Path
        d="M51.2 716.8m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 4, '#333333')}
      />
      <Path
        d="M972.8 716.8m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 5, '#333333')}
      />
      <Path
        d="M51.2 307.2m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 6, '#333333')}
      />
      <Path
        d="M972.8 307.2m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 7, '#333333')}
      />
      <Path
        d="M51.2 499.2m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 8, '#333333')}
      />
      <Path
        d="M947.2 499.2m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 9, '#333333')}
      />
    </Svg>
  );
};

IconScan.defaultProps = {
  size: 18,
};

IconScan = React.memo ? React.memo(IconScan) : IconScan;

export default IconScan;
