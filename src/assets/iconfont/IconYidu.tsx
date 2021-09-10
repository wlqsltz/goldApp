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

let IconYidu: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M649.984 466.816a25.2928 25.2928 0 0 1 4.5568 50.176l-4.5568 0.4352H153.344a25.2928 25.2928 0 0 1-4.5568-50.2016l4.5568-0.4096h496.64z m-165.5552 262.1184a25.2928 25.2928 0 0 1 4.5568 50.1504l-4.5568 0.384H153.344a25.2928 25.2928 0 0 1-4.5568-50.176l4.5568-0.3584h331.0848zM815.5136 204.8a25.2928 25.2928 0 0 1 4.5568 50.176l-4.5568 0.4352H153.344a25.2928 25.2928 0 0 1-4.5568-50.2016L153.344 204.8h662.1696z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M852.5824 569.6512c4.2752-6.4768 13.6704-9.1392 21.6832-6.1184 7.9872 3.0208 11.9808 10.7008 9.1904 17.7408l-1.2288 2.3808-120.4736 183.4496-125.6192-68.8128c-7.3984-4.0448-9.9328-12.1856-5.8368-18.7904s13.44-9.472 21.5552-6.6048l2.7136 1.2288 95.1552 52.1216 102.8608-156.5952z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </Svg>
  );
};

IconYidu.defaultProps = {
  size: 18,
};

IconYidu = React.memo ? React.memo(IconYidu) : IconYidu;

export default IconYidu;
