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

let IconTip: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M571.134943 546.559441a59.134801 59.134801 0 1 1-118.269601 0V270.853032a59.134801 59.134801 0 1 1 118.269601 0v275.706409z m-59.134801 255.994809a58.878806 58.878806 0 1 1 41.727154-17.151652 57.086842 57.086842 0 0 1-41.727154 17.151652zM512.000142 0.010524a501.749826 501.749826 0 0 0-199.391512 39.93519 509.685665 509.685665 0 0 0-272.662915 272.634472A501.749826 501.749826 0 0 0 0.010524 512.000142a501.749826 501.749826 0 0 0 39.935191 199.391513 509.685665 509.685665 0 0 0 272.634471 272.662915A501.749826 501.749826 0 0 0 512.000142 1023.98976a501.749826 501.749826 0 0 0 199.391513-39.93519 509.685665 509.685665 0 0 0 272.662915-272.634472A501.749826 501.749826 0 0 0 1023.98976 512.000142a501.749826 501.749826 0 0 0-39.93519-199.391512 509.685665 509.685665 0 0 0-272.634471-272.662916A501.749826 501.749826 0 0 0 512.000142 0.010524z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconTip.defaultProps = {
  size: 18,
};

IconTip = React.memo ? React.memo(IconTip) : IconTip;

export default IconTip;
