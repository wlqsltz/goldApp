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

let IconHot: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M717.084444 547.84a29.724444 29.724444 0 0 0-51.143111 9.216 221.383111 221.383111 0 0 1-38.030222 67.128889c1.194667-11.036444 1.792-22.158222 1.792-33.28-0.142222-13.795556-1.024-27.591111-2.673778-41.301333a304.924444 304.924444 0 0 0-22.897777-79.928889 33.877333 33.877333 0 0 0-3.868445-8.334223 297.159111 297.159111 0 0 0-109.056-125.383111 29.724444 29.724444 0 0 0-29.724444 0c-9.557333 5.091556-15.587556 14.990222-15.729778 25.856a204.743111 204.743111 0 0 1-21.703111 89.144889 198.826667 198.826667 0 0 1-75.776 81.720889 267.463111 267.463111 0 0 0-84.394667 78.734222A260.608 260.608 0 0 0 221.667556 753.777778a256.170667 256.170667 0 0 0 29.724444 123.022222 263.281778 263.281778 0 0 0 93.013333 98.360889c10.069333 6.798222 23.239111 6.798222 33.28 0 9.756444-7.111111 14.222222-19.484444 11.292445-31.203556a263.594667 263.594667 0 0 1-6.826667-59.448889 247.836444 247.836444 0 0 1 17.237333-91.505777 232.96 232.96 0 0 1 17.834667-38.030223l1.792 4.152889a464.782222 464.782222 0 0 0 196.721778 218.112c6.343111 3.811556 12.885333 7.310222 19.626667 10.410667l3.242666 1.792c10.439111 5.006222 22.869333 3.498667 31.800889-3.868444a312.604444 312.604444 0 0 0 106.097778-164.949334c6.257778-25.372444 9.557333-51.399111 9.813333-77.539555a311.125333 311.125333 0 0 0-69.262222-195.242667z"
        fill={getIconColor(color, 0, '#FFC824')}
      />
      <Path
        d="M276.366222 366.250667a29.724444 29.724444 0 0 1-24.974222-13.368889 29.724444 29.724444 0 0 1 8.618667-41.016889l12.487111-8.021333a29.724444 29.724444 0 0 1 29.724444 51.114666l-8.618666 6.542222c-5.12 3.328-11.150222 4.977778-17.237334 4.750223z"
        fill={getIconColor(color, 1, '#333333')}
      />
      <Path
        d="M696.263111 1010.517333c-3.555556 0-7.054222-0.597333-10.410667-1.763555a406.840889 406.840889 0 0 1-69.518222-32.426667 464.782222 464.782222 0 0 1-196.750222-218.112l-1.763556-4.152889a232.96 232.96 0 0 0-17.834666 38.030222 252.871111 252.871111 0 0 0-3.868445 172.942223 29.724444 29.724444 0 0 1-36.551111 37.774222 386.332444 386.332444 0 0 1-228.522666-187.534222A386.332444 386.332444 0 0 1 166.115556 398.648889a29.724444 29.724444 0 0 1 46.933333 36.266667c-5.347556 7.111111-10.382222 14.250667-15.132445 21.674666a326.883556 326.883556 0 0 0-14.563555 331.064889 326.883556 326.883556 0 0 0 142.620444 138.467556 332.828444 332.828444 0 0 1-2.673777-42.496c-0.056889-38.513778 7.111111-76.714667 21.105777-112.64a304.924444 304.924444 0 0 1 59.448889-99.555556 29.724444 29.724444 0 0 1 29.696-8.903111c10.524444 2.56 18.858667 10.638222 21.703111 21.105778 4.977778 17.294222 11.036444 34.275556 18.119111 50.830222a407.409778 407.409778 0 0 0 172.088889 190.464c14.791111 8.817778 30.293333 16.384 46.364445 22.584889a406.840889 406.840889 0 0 0 158.065778-230.286222c7.907556-32.398222 11.918222-65.621333 11.889777-98.986667a396.714667 396.714667 0 0 0-59.448889-211.256889c-5.916444 11.861333-12.572444 23.381333-19.911111 34.446222a371.484444 371.484444 0 0 1-124.188444 120.661334c-9.813333 5.660444-19.342222 10.695111-29.724445 15.445333-11.178667 5.233778-24.462222 2.986667-33.28-5.632a29.724444 29.724444 0 0 1-4.465777-33.28 384.256 384.256 0 0 0 29.724444-154.823111c-0.056889-18.090667-1.137778-36.124444-3.271111-54.101333a396.714667 396.714667 0 0 0-29.724444-104.305778V222.151111l-1.763556-3.271111a384.256 384.256 0 0 0-100.465778-133.404444 391.68 391.68 0 0 1-37.148444 113.208888 29.724444 29.724444 0 0 1-52.906667-26.737777 334.307556 334.307556 0 0 0 34.787556-142.051556 29.724444 29.724444 0 0 1 46.08-24.974222 445.752889 445.752889 0 0 1 162.247111 187.221333c2.104889 3.356444 3.783111 6.940444 5.034666 10.695111a451.982222 451.982222 0 0 1 33.877334 118.897778c2.076444 20.622222 2.958222 41.358222 2.673778 62.094222a460.629333 460.629333 0 0 1-10.382223 96.881778 315.306667 315.306667 0 0 0 62.094223-71.338667c15.701333-22.357333 28.302222-46.762667 37.461333-72.504888a29.724444 29.724444 0 0 1 50.204444-9.813334 463.872 463.872 0 0 1 102.542223 290.645334 475.591111 475.591111 0 0 1-13.681778 113.208888 465.664 465.664 0 0 1-195.527111 274.289778 29.724444 29.724444 0 0 1-16.355556 5.347556z"
        fill={getIconColor(color, 2, '#333333')}
      />
    </Svg>
  );
};

IconHot.defaultProps = {
  size: 18,
};

IconHot = React.memo ? React.memo(IconHot) : IconHot;

export default IconHot;
