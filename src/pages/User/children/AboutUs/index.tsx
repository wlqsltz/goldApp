import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {getArticleList, getArticleTypeList, getSystemType} from '@/api/public';
import {TranslateYAndOpacity} from 'react-native-motion';
import IconFont from '@/assets/iconfont';
import LogoVersionIcon from '@/assets/image/user/aboutUs/logo_version.png';

interface IProps {
  navigation: RootStackNavigation;
}

const AboutUs: React.FC<IProps> = ({navigation}) => {
  const [list, setList] = useState<IArticle[]>([]);
  const [latestVersion, setLatestVersion] = useState('');

  const goVersionLog = useCallback(() => {
    navigation.navigate('VersionLog');
  }, [navigation]);

  useEffect(() => {
    const init = async () => {
      getArticleTypeList('2').then(async types => {
        if (Array.isArray(types)) {
          const data = await getArticleList(types[0].id);
          setList(data as IArticle[]);
        }
      });
      // getMsg('version').then((d: any) => {
      //   this.setState({
      //     version: d,
      //   });
      // });
      let type = Platform.OS === 'ios' ? 'ios-c' : 'android-c';
      getSystemType(type).then((d: any) => {
        setLatestVersion(d.version);
      });
    };
    init();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={[GlobalStyles.flex_1, GlobalStyles.bg_fff]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.about_top}>
          <Image style={styles.at_pic} source={LogoVersionIcon} />
          <Text style={styles.at_bb}>小圈子 3.4.0</Text>
        </View>
        <Touchable style={styles.at_single} onPress={goVersionLog}>
          <Text style={styles.at_s_txt}>版本日志</Text>
          <IconFont name="icon-right" color="#ccc" size={13} />
        </Touchable>
        <Touchable
          style={[styles.at_single, styles.no_border]}
          onPress={() => {
            // if (latestVersion !== version) {
            //   toAppUpdate(true, true);
            // }
          }}>
          <Text style={styles.at_s_txt}>版本更新</Text>
          <Text style={styles.at_r_t}>
            3.4.0 已是最新版本
            {/* {latestVersion === version
              ? `${version} 已是最新版本`
              : `最新版本为${latestVersion}`} */}
          </Text>
        </Touchable>
        <View style={styles.bar} />
        {list.length ? (
          <TranslateYAndOpacity animateOnDidMount={true}>
            {list.map(item => (
              <Touchable
                key={item.id}
                style={styles.at_single}
                onPress={() =>
                  navigation.navigate('CommonDetail', {
                    title: item.title,
                    content: item.content,
                  })
                }>
                <Text style={styles.at_s_txt}>{item.title}</Text>
                <IconFont name="icon-right" color="#ccc" size={13} />
              </Touchable>
            ))}
          </TranslateYAndOpacity>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  about_top: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  at_pic: {
    width: 105,
    height: 50,
    marginBottom: 17,
  },
  at_bb: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
  at_single: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    justifyContent: 'space-between',
  },
  no_border: {
    borderBottomWidth: 0,
  },
  at_s_txt: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 23,
    fontFamily: 'PingFangSC-Regular',
  },
  at_r_t: {
    color: '#999999',
    fontSize: 15,
    lineHeight: 23,
    fontFamily: 'PingFangSC-Regular',
  },
  bar: {
    height: 10,
    backgroundColor: '#F3F3F3',
  },
});

export default AboutUs;
