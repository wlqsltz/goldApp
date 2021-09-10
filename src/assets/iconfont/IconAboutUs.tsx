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

let IconAboutUs: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 77.568c239.941818 0 434.432 194.513455 434.432 434.432 0 239.941818-194.513455 434.432-434.432 434.432-239.941818 0-434.432-194.513455-434.432-434.432C77.568 272.058182 272.081455 77.568 512 77.568z m36.840727 395.636364h-122.181818V558.545455h40.727273v85.34109h-40.727273v85.317819h162.909091v-85.317819h-40.727273v-170.682181z m-5.818182-162.909091h-93.090909v93.090909h93.090909v-93.090909z"
        fill={getIconColor(color, 0, '#D7B881')}
      />
    </Svg>
  );
};

IconAboutUs.defaultProps = {
  size: 18,
};

IconAboutUs = React.memo ? React.memo(IconAboutUs) : IconAboutUs;

export default IconAboutUs;
