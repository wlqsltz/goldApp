import React, {useCallback} from 'react';
import {View, Text, StyleSheet, InteractionManager} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import Touchable from '@/components/Touchable';
import IconFont from '@/assets/iconfont';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import CpsItem from './CpsItem';

interface IProps {}

const selectOperatorList = createSelector(
  (state: RootState) => state.home,
  home => home.operatorList,
);

const CpsList: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const operatorList = useSelector(selectOperatorList);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        dispatch({
          type: 'home/getOperators',
        });
      });
      return () => task.cancel();
    }, [dispatch]),
  );

  const navigation = useNavigation<RootStackNavigation>();
  const goTradersList = useCallback(() => {
    navigation.navigate('CpsList');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <IconFont name="icon-hot" size={20} />
        <Text style={styles.head_title}>热门操盘手</Text>
        <Touchable onPress={goTradersList}>
          <View style={styles.head_right}>
            <Text style={styles.head_right_all}>全部</Text>
            <IconFont name="icon-right" size={14} color="#A4A4AC" />
          </View>
        </Touchable>
      </View>
      <View style={styles.list_container}>
        {operatorList.map((item, index) => (
          <CpsItem key={item.id} info={item} rank={index + 1} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 244,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 14,
    paddingTop: 15,
    paddingBottom: 9,
  },
  head_title: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 23,
  },
  head_right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  head_right_all: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#A4A4AC',
    lineHeight: 19,
  },
  list_container: {
    paddingLeft: 6,
    paddingRight: 6,
    flexDirection: 'row',
  },
});

export default CpsList;
