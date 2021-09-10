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

let IconFanhui: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M407.00928 512l286.00832-286.00832a35.84 35.84 0 0 0-50.68288-50.68288L330.9824 486.656a35.84 35.84 0 0 0 0 50.68288l311.35744 311.35232a35.84 35.84 0 0 0 50.68288-50.68288L407.00928 512z"
        fill={getIconColor(color, 0, '#666666')}
      />
    </Svg>
  );
};

IconFanhui.defaultProps = {
  size: 18,
};

IconFanhui = React.memo ? React.memo(IconFanhui) : IconFanhui;

export default IconFanhui;
