import React from 'react';
import {Image} from 'react-native';
import {delImgQuality} from '@/utils/index';
import DefAvatarIcon from '@/assets/image/def_avatar.png';

interface Props {
  uri?: string;
  quality?: number;
  [key: string]: any;
}

export default function Avatar({uri, quality = 10, ...rest}: Props) {
  return (
    <Image
      source={uri ? {uri: delImgQuality(uri, quality)} : DefAvatarIcon}
      resizeMode="cover"
      {...rest}
    />
  );
}
