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

let IconMore: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M34.133333 136.533333m51.2 0l853.333334 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-853.333334 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M34.133333 443.733333m51.2 0l853.333334 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-853.333334 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z"
        fill={getIconColor(color, 1, '#333333')}
      />
      <Path
        d="M34.133333 750.933333m51.2 0l853.333334 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-853.333334 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z"
        fill={getIconColor(color, 2, '#333333')}
      />
    </Svg>
  );
};

IconMore.defaultProps = {
  size: 18,
};

IconMore = React.memo ? React.memo(IconMore) : IconMore;

export default IconMore;
