import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import Touchable from '@/components/Touchable';
import GlobalStyles from '@/assets/style/global';
import ApiIcon from '@/assets/image/home/api.png';
import BillIcon from '@/assets/image/home/bill.png';
import {useNavigation} from '@react-navigation/native';

interface IProps {}

const Navs: React.FC<IProps> = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const goApiAuthorization = useCallback(() => {
    navigation.navigate('ApiAuthorization');
  }, [navigation]);
  const goElectronicBilling = useCallback(() => {
    navigation.navigate('ElectronicBilling');
  }, [navigation]);

  return (
    <View style={styles.contaienr}>
      <Touchable
        onPress={goApiAuthorization}
        style={[styles.item, styles.border]}>
        <View style={GlobalStyles.flex_1}>
          <View>
            <Text style={styles.title}>API授权</Text>
          </View>
          <Text style={styles.sub_title}>快捷办理 一键授权</Text>
        </View>
        <Image style={styles.image} source={ApiIcon} />
      </Touchable>
      <Touchable onPress={goElectronicBilling} style={styles.item}>
        <View style={GlobalStyles.flex_1}>
          <Text style={styles.title}>电子账单</Text>
          <Text style={styles.sub_title}>极速查询 轻松知晓</Text>
        </View>
        <Image style={styles.image} source={BillIcon} />
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  contaienr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 19,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  border: {
    borderRightWidth: 1,
    borderRightColor: '#E1E3E6',
  },
  title: {
    color: '#333',
    fontSize: 18,
    marginBottom: 5,
    lineHeight: 25,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
  },
  sub_title: {
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 15,
    fontSize: 11,
  },
  image: {
    width: 46,
    height: 46,
  },
});

export default Navs;
