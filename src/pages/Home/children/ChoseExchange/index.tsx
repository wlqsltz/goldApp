import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Platform,
  ListRenderItemInfo,
  FlatList,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {exchangeListFront} from '@/api/public';
import Touchable from '@/components/Touchable';
import {delImgQuality} from '@/utils/index';
import IconFont from '@/assets/iconfont';

const themeColor = '#D59420';

interface IProps {
  navigation: RootStackNavigation;
}

export interface IExchange {
  cname: string;
  ename: string;
  id: string;
  logo: string;
  orderNo: number;
  status: string;
  statusName: string;
}

const ChoseExchange: React.FC<IProps> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [exchangeList, setExchangeList] = useState<IExchange[]>([]);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setLoading(true);
      exchangeListFront()
        .then(d => {
          setExchangeList(d as IExchange[]);
        })
        .finally(() => setLoading(false));
    });
  }, []);
  const choseExchange = useCallback(
    (data: IExchange) => {
      navigation.navigate('BindApi', {
        exchangeNo: data.id,
        from: 'ApiAuthorization',
      });
    },
    [navigation],
  );
  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await exchangeListFront();
      setExchangeList(data as IExchange[]);
    } catch (error) {}
    setLoading(false);
  }, []);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<IExchange>) => {
      return (
        <Touchable
          onPress={() => choseExchange(item)}
          key={item.id}
          style={styles.exchageWrap}>
          <Image
            style={styles.exchage_logo}
            source={{uri: delImgQuality(item.logo, 10) || ''}}
          />
          <Text style={styles.exchage_txt}>绑定{item.cname || ''}API</Text>
          <IconFont name="icon-right" size={18} />
        </Touchable>
      );
    },
    [choseExchange],
  );
  return (
    <FlatList
      style={styles.container}
      data={exchangeList}
      renderItem={renderItem}
      refreshing={loading}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={[themeColor]}
          tintColor={themeColor}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  exchageWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 7,
    marginBottom: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  exchage_logo: {
    width: 82,
    height: 29,
  },
  exchage_txt: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    marginRight: 5,
  },
  // exchage_icon: {
  //   width: 18,
  //   height: 18,
  //   flexShrink: 0,
  // },
});

export default ChoseExchange;
