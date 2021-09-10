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

let IconHelpCenter: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M847.499636 960.488727H175.499636a64 64 0 0 1-64-64V192.488727a64 64 0 0 1 64-64h85.480728a96.023273 96.023273 0 0 1 90.530909-64h320a96.023273 96.023273 0 0 1 90.507636 64h85.480727a64 64 0 0 1 64 64v704a64 64 0 0 1-64 64z m-379.508363-99.234909c8.308364 8.378182 18.757818 12.520727 31.255272 12.520727 12.497455 0 22.900364-4.165818 31.255273-12.520727 8.308364-8.285091 12.497455-18.734545 12.497455-31.232s-4.189091-22.900364-12.497455-31.255273c-8.354909-8.308364-18.757818-12.497455-31.255273-12.497454-12.497455 0-22.946909 4.189091-31.255272 12.497454-8.331636 8.354909-12.497455 18.757818-12.497455 31.255273 0 12.497455 4.165818 22.946909 12.497455 31.232z m-76.450909-359.354182a34.909091 34.909091 0 0 0 34.536727-30.557091c3.141818-24.133818 10.333091-42.589091 21.620364-55.38909 15.592727-17.687273 34.862545-26.554182 57.809454-26.554182 22.900364 0 40.610909 6.772364 53.108364 20.293818 12.520727 13.591273 18.757818 33.885091 18.757818 60.951273 0 14.592-3.118545 29.672727-9.378909 45.312-6.237091 15.616-17.710545 30.766545-34.373818 45.312-22.946909 20.852364-39.051636 40.122182-48.430546 57.809454a115.572364 115.572364 0 0 0-14.056727 54.690909v19.456c0 6.516364 5.259636 11.799273 11.776 11.799273h32.698182c6.493091 0 11.776-5.282909 11.776-11.799273v-10.077091c0-6.260364 4.142545-17.687273 12.497454-34.373818 8.285091-16.663273 22.900364-33.303273 43.752728-50.013091a194.932364 194.932364 0 0 0 49.989818-59.368727 153.995636 153.995636 0 0 0 18.757818-75.008c0-39.563636-13.032727-71.866182-39.074909-96.861091-26.065455-25.018182-61.998545-37.515636-107.799273-37.515636-41.704727 0-77.102545 14.08-106.263273 42.193454-21.969455 21.178182-36.258909 50.920727-42.868363 89.204364-3.630545 21.178182 12.846545 40.494545 34.327272 40.494545h0.837819zM671.511273 128.465455H352.162909c-17.454545 0-32.162909 13.684364-32.651636 31.115636a32 32 0 0 0 32 32.884364h319.301818c17.454545 0 32.186182-13.661091 32.674909-31.092364a32 32 0 0 0-31.976727-32.907636z"
        fill={getIconColor(color, 0, '#D7B881')}
      />
    </Svg>
  );
};

IconHelpCenter.defaultProps = {
  size: 18,
};

IconHelpCenter = React.memo ? React.memo(IconHelpCenter) : IconHelpCenter;

export default IconHelpCenter;
