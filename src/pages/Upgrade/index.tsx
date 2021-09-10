import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {useHeaderHeight} from '@react-navigation/stack';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {RootState} from '@/models/index';
import SjTitleIcon from '@/assets/image/upgrade/sj_title.png';
import SjBgIcon from '@/assets/image/upgrade/sj_bg.png';

interface IProps {}

const themeColor = '#D59420';

const selectConfig = createSelector(
  (state: RootState) => state.upgrade,
  upgrade => upgrade.config,
);

const Upgrade: React.FC<IProps> = () => {
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'upgrade/getConfig',
    });
  }, [dispatch]);

  const headerHeight = useHeaderHeight();
  const padTopStyle = useMemo(
    () => ({paddingTop: headerHeight}),
    [headerHeight],
  );

  return (
    <View style={styles.upg_page}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.sj_title_box, padTopStyle]}>
        <Image style={styles.sj_title_icon} source={SjTitleIcon} />
      </View>
      <View style={styles.upg_bb}>
        <Text style={styles.upg_btxt}>新版本：{config?.version}</Text>
      </View>
      <ImageBackground style={styles.upg_con} source={SjBgIcon}>
        <View style={styles.u_c_box}>
          <Text style={styles.u_c_tit}>尊敬的用户：</Text>
          <Text style={styles.uc_txt}>{config?.note_text}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  upg_page: {
    flex: 1,
    backgroundColor: themeColor,
    alignItems: 'center',
  },
  sj_title_box: {
    alignItems: 'center',
  },
  sj_title_icon: {
    width: 267,
    height: 47,
  },
  upg_bb: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    backgroundColor: '#AF750D',
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 13,
  },
  upg_btxt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'PingFang SC',
  },
  upg_con: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: ifIphoneX(52, 32),
    paddingHorizontal: 23,
  },
  u_c_box: {
    backgroundColor: '#fff',
    paddingTop: 23,
    paddingBottom: 20,
    paddingHorizontal: 23,
    borderRadius: 7,
  },
  u_c_tit: {
    color: themeColor,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: 'PingFangSC-Regular',
  },
  uc_txt: {
    width: 284,
    color: '#999999',
    fontSize: 13,
    lineHeight: 21,
    fontFamily: 'PingFangSC-Regular',
  },
});

export default Upgrade;
