import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {RootStackNavigation} from '@/navigator/index';
import {IEntity} from '..';
import IconFont from '@/assets/iconfont';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';

interface IProps {
  data: IEntity;
}

const Item: React.FC<IProps> = ({data}) => {
  const navigation = useNavigation<RootStackNavigation>();
  const goOnedayProfit = useCallback(() => {
    navigation.navigate('OnedayProfit', {
      currency: data.currency,
      date: data.date,
      dayIncome: data.dayIncome,
    });
  }, [data.currency, data.date, data.dayIncome, navigation]);
  return (
    <Touchable
      onPress={goOnedayProfit}
      style={[styles.container, GlobalStyles.flex_row]}>
      <Text style={styles.date}>{data.date}</Text>
      <View style={[GlobalStyles.flex_row, GlobalStyles.flex_1]}>
        <Text style={styles.title}>盈利</Text>
        <Text style={styles.day_income}>
          {+data.dayIncome > 0 ? `+${data.dayIncome}` : data.dayIncome}
        </Text>
      </View>
      <IconFont name="icon-right" color="#999" size={12} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 51,
    backgroundColor: '#fff',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  date: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
  },
  title: {
    paddingLeft: 20,
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#A8ACBB',
    lineHeight: 15,
  },
  day_income: {
    marginLeft: 3,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2BAD6F',
    lineHeight: 23,
  },
});

export default Item;
