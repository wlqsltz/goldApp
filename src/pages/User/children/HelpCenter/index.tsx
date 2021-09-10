import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {TranslateYAndOpacity} from 'react-native-motion';
import {RootStackNavigation} from '@/navigator/index';
import BgIcon from '@/assets/image/user/helpCenter/bg.png';
import GlobalStyles from '@/assets/style/global';
import {delImgQuality, SCREEN_WIDTH} from '@/utils/index';
import Touchable from '@/components/Touchable';
import {getArticleList, getArticleTypeList} from '@/api/public';

interface IProps {
  navigation: RootStackNavigation;
}

interface IEntity {
  id: string;
  icon: string;
  name: string;
  children: IArticle[];
}

const HelpCenter: React.FC<IProps> = ({navigation}) => {
  const [list, setList] = useState<IEntity[]>([]);
  useEffect(() => {
    const init = async () => {
      const types = await getArticleTypeList('0');
      if (Array.isArray(types)) {
        const result: IEntity[] = [];
        for (let i = 0; i < types.length; i++) {
          const data = await getArticleList(types[i].id);
          result.push({
            id: types[i].id,
            icon: types[i].icon,
            name: types[i].name,
            children: data as IArticle[],
          });
        }
        setList(result);
      }
    };
    init();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Image source={BgIcon} style={styles.bg} />
      <View style={styles.c_head}>
        <Text style={styles.content_title}>常见问题</Text>
      </View>
      <ScrollView
        style={[GlobalStyles.flex_1, GlobalStyles.bg_fff]}
        showsVerticalScrollIndicator={false}>
        {list.length ? (
          <TranslateYAndOpacity animateOnDidMount={true}>
            {list.map((item, index) => (
              <View key={item.id}>
                <View style={styles.c_ul}>
                  <View style={styles.cu_head}>
                    <Image
                      style={styles.cu_head_icon}
                      source={{uri: delImgQuality(item.icon, 10)}}
                    />
                    <Text style={styles.cuh_txt}>{item.name}</Text>
                  </View>
                  {Array.isArray(item.children) &&
                    item.children.map(it => (
                      <Touchable
                        key={it.id}
                        style={styles.cu_item}
                        onPress={() => {
                          navigation.navigate('CommonDetail', {
                            title: it.title,
                            content: it.content,
                          });
                        }}>
                        <Text style={styles.cui_txt}>· {it.title}</Text>
                      </Touchable>
                    ))}
                </View>
                {index < list.length - 1 ? <View style={styles.bar} /> : null}
              </View>
            ))}
          </TranslateYAndOpacity>
        ) : null}
        <View style={GlobalStyles.h50} />
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: 196 + getStatusBarHeight(),
    paddingTop: 50,
  },
  c_head: {
    height: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#D8D8D8',
    backgroundColor: '#fff',
  },
  content_title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
  },
  c_ul: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  cu_head: {
    height: 42,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cu_head_icon: {
    width: 22,
    height: 22,
  },
  cuh_txt: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'PingFangSC-Regular',
    marginLeft: 6,
  },
  cu_item: {
    height: 51,
    justifyContent: 'center',
    borderColor: '#D8D8D8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cui_txt: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
  },
  bar: {
    backgroundColor: '#F6F6F8',
    height: 10,
    width: SCREEN_WIDTH,
  },
});

export default HelpCenter;
