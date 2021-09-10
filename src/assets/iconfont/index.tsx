/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconGuanbi from './IconGuanbi';
import IconMoreDot from './IconMoreDot';
import IconAboutUs from './IconAboutUs';
import IconHelpCenter from './IconHelpCenter';
import IconSetting from './IconSetting';
import IconEdit from './IconEdit';
import IconSousuo from './IconSousuo';
import IconYidu from './IconYidu';
import IconClose from './IconClose';
import IconTip from './IconTip';
import IconShequ from './IconShequ';
import IconJiangbei from './IconJiangbei';
import IconRight from './IconRight';
import IconHot from './IconHot';
import IconMore from './IconMore';
import IconFanhui from './IconFanhui';

export type IconNames = 'icon-guanbi' | 'icon-more-dot' | 'icon-about-us' | 'icon-help-center' | 'icon-setting' | 'icon-edit' | 'icon-sousuo' | 'icon-yidu' | 'icon-close' | 'icon-tip' | 'icon-shequ' | 'icon-jiangbei' | 'icon-right' | 'icon-hot' | 'icon-more' | 'icon-fanhui';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'icon-guanbi':
      return <IconGuanbi key="1" {...rest} />;
    case 'icon-more-dot':
      return <IconMoreDot key="2" {...rest} />;
    case 'icon-about-us':
      return <IconAboutUs key="3" {...rest} />;
    case 'icon-help-center':
      return <IconHelpCenter key="4" {...rest} />;
    case 'icon-setting':
      return <IconSetting key="5" {...rest} />;
    case 'icon-edit':
      return <IconEdit key="6" {...rest} />;
    case 'icon-sousuo':
      return <IconSousuo key="7" {...rest} />;
    case 'icon-yidu':
      return <IconYidu key="8" {...rest} />;
    case 'icon-close':
      return <IconClose key="9" {...rest} />;
    case 'icon-tip':
      return <IconTip key="10" {...rest} />;
    case 'icon-shequ':
      return <IconShequ key="11" {...rest} />;
    case 'icon-jiangbei':
      return <IconJiangbei key="12" {...rest} />;
    case 'icon-right':
      return <IconRight key="13" {...rest} />;
    case 'icon-hot':
      return <IconHot key="14" {...rest} />;
    case 'icon-more':
      return <IconMore key="15" {...rest} />;
    case 'icon-fanhui':
      return <IconFanhui key="16" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
