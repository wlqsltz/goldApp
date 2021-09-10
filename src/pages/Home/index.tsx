import React from 'react';
import {StatusBar, StyleSheet, ScrollView} from 'react-native';
import {createSelector} from 'reselect';
import {useSelector, useDispatch} from 'react-redux';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import Carousel from './components/Carousel';
import Message from './components/Message';
import Markets from './components/Markets';
import Navs from './components/Navs';
import CpsList from './components/CpsList';
import RankList from './components/RankList';
import GlobalStyles from '@/assets/style/global';

interface IProps {
  navigation: RootStackNavigation;
}

const selectLoading = createSelector(
  (state: RootState) => state.loading,
  loading => loading.effects['home/getCarousels'],
);

const Home: React.FC<IProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  return (
    <ScrollView style={[styles.container, GlobalStyles.flex_1]}>
      <StatusBar barStyle="dark-content" />
      <Carousel />
      <Message />
      <Markets />
      <Navs />
      <CpsList />
      <RankList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FA',
  },
});

export default Home;
