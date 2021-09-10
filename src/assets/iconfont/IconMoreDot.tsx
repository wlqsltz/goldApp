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

let IconMoreDot: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M363.240727 275.456h497.803637a43.357091 43.357091 0 0 0 0-86.714182h-497.803637a43.357091 43.357091 0 1 0 0 86.714182z m497.803637 196.468364h-497.803637a43.357091 43.357091 0 0 0 0 86.714181h497.803637a43.357091 43.357091 0 0 0 0-86.714181z m0 283.182545h-497.803637a43.357091 43.357091 0 1 0 0 86.690909h497.803637a43.357091 43.357091 0 0 0 0-86.690909zM125.114182 232.098909a76.567273 76.567273 0 1 0 153.181091 0 76.567273 76.567273 0 0 0-153.181091 0zM125.114182 513.861818a76.567273 76.567273 0 1 0 153.181091 0 76.567273 76.567273 0 0 0-153.181091 0zM125.114182 795.648a76.567273 76.567273 0 1 0 153.181091 0 76.567273 76.567273 0 0 0-153.181091 0z"
        fill={getIconColor(color, 0, '#D59420')}
      />
    </Svg>
  );
};

IconMoreDot.defaultProps = {
  size: 18,
};

IconMoreDot = React.memo ? React.memo(IconMoreDot) : IconMoreDot;

export default IconMoreDot;
