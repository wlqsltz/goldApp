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

let IconEdit: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 512m-490.666667 0a490.666667 490.666667 0 1 0 981.333334 0 490.666667 490.666667 0 1 0-981.333334 0Z"
        fill={getIconColor(color, 0, '#D59420')}
      />
      <Path
        d="M503.616 402.218667l120.469333 120.448-170.965333 170.986666a17.514667 17.514667 0 0 1-10.304 6.890667 17.493333 17.493333 0 0 1-6.506667 0.448l-93.717333-0.362667a17.493333 17.493333 0 0 1-17.429333-17.514666l0.149333-93.269334a17.6 17.6 0 0 1 0.298667-5.696 17.493333 17.493333 0 0 1 7.338666-11.221333l170.666667-170.709333z m94.229333-69.418667l95.68 95.68c6.826667 6.826667 6.826667 17.92 0 24.746667l-44.693333 44.693333-120.469333-120.448 44.714666-44.672a17.493333 17.493333 0 0 1 24.746667 0zM681.152 701.013333H512a17.493333 17.493333 0 0 1 0-35.008h169.152a17.493333 17.493333 0 0 1 0 34.986667z"
        fill={getIconColor(color, 1, '#FBFFFE')}
      />
    </Svg>
  );
};

IconEdit.defaultProps = {
  size: 18,
};

IconEdit = React.memo ? React.memo(IconEdit) : IconEdit;

export default IconEdit;
