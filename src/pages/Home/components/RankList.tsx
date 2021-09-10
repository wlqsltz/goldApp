import React, {useCallback, useState} from 'react';
import {Image, InteractionManager, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TranslateYAndOpacity} from 'react-native-motion';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import IconFont from '@/assets/iconfont';
import Empty from '@/components/Empty';
import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import Rank1Icon from '@/assets/image/home/rank1.png';
import Rank2Icon from '@/assets/image/home/rank2.png';
import Rank3Icon from '@/assets/image/home/rank3.png';
import Avatar from '@/components/Avatar';
import {IRank} from '@/models/home';

function getRankComp(index: number) {
  switch (index) {
    case 0:
      return <Image style={styles.ranking_item_icon} source={Rank1Icon} />;
    case 1:
      return <Image style={styles.ranking_item_icon} source={Rank2Icon} />;
    case 2:
      return <Image style={styles.ranking_item_icon} source={Rank3Icon} />;
    default:
      return <Text style={styles.ranking_item_rk}>{index + 1}</Text>;
  }
}

function getRankListComp(list: IRank[]) {
  return (
    <TranslateYAndOpacity animateOnDidMount={true}>
      {list.length > 0 ? (
        list.map((item, index) => (
          <View key={item.userId} style={styles.ranking_item}>
            <View style={styles.ranking_item1}>{getRankComp(index)}</View>
            <View style={styles.ranking_item2}>
              <Avatar style={styles.ranking_item_pic} uri={item.photo} />
              <Text style={styles.ranking_item_name} numberOfLines={1}>
                {item.userName}
              </Text>
            </View>
            <View style={styles.ranking_item3}>
              <Text style={styles.ranking_item_income}>{item.income}</Text>
            </View>
          </View>
        ))
      ) : (
        <Empty message="暂无排行信息～" />
      )}
    </TranslateYAndOpacity>
  );
}

interface IProps {}

const selectUserRankList = createSelector(
  (state: RootState) => state.home,
  home => home.userRankList,
);
const selectTeamRankList = createSelector(
  (state: RootState) => state.home,
  home => home.teamRankList,
);

const RankList: React.FC<IProps> = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        dispatch({
          type: 'home/getRanks',
        });
      });
      return () => task.cancel();
    }, [dispatch]),
  );

  const userRankList = useSelector(selectUserRankList);
  const teamRankList = useSelector(selectTeamRankList);

  return (
    <View style={styles.container}>
      <View style={styles.ranking_title}>
        <Touchable
          onPress={() => setActiveIndex(0)}
          style={styles.ranking_title_item}>
          {activeIndex === 0 ? (
            <TranslateYAndOpacity animateOnDidMount>
              <IconFont name="icon-jiangbei" />
            </TranslateYAndOpacity>
          ) : null}
          <Text
            style={[
              styles.ranking_title_txt,
              activeIndex === 0 ? styles.ranking_title_item_active_txt : null,
            ]}>
            用户排行榜
          </Text>
        </Touchable>
        <View style={styles.ranking_split} />
        <Touchable
          onPress={() => setActiveIndex(1)}
          style={styles.ranking_title_item}>
          {activeIndex === 1 ? (
            <TranslateYAndOpacity animateOnDidMount>
              <IconFont name="icon-shequ" />
            </TranslateYAndOpacity>
          ) : null}
          <Text
            style={[
              styles.ranking_title_txt,
              activeIndex === 1 ? styles.ranking_title_item_active_txt : null,
            ]}>
            社群排行榜
          </Text>
        </Touchable>
      </View>
      <View style={styles.ranking_list}>
        <View style={styles.ranking_item_tit}>
          <View style={styles.ranking_item1}>
            <Text style={styles.ranking_item_tit_txt}>排名</Text>
          </View>
          <View style={styles.ranking_item2}>
            <Text style={styles.ranking_item_tit_txt}>
              {activeIndex === 0 ? '用户' : '社群'}
            </Text>
          </View>
          <View style={styles.ranking_item3}>
            <Text style={styles.ranking_item_tit_txt}>总收益(USDT)</Text>
          </View>
        </View>
        {activeIndex === 0 ? getRankListComp(userRankList) : null}
        {activeIndex === 1 ? getRankListComp(teamRankList) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ranking_title: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E1E3E6',
    alignItems: 'center',
  },
  ranking_title_item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 16,
  },
  ranking_title_item_active_txt: {
    color: '#333',
  },
  ranking_title_txt: {
    color: '#ABADB5',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    lineHeight: 23,
    marginLeft: 5,
  },
  ranking_split: {
    backgroundColor: '#E1E3E6',
    width: StyleSheet.hairlineWidth,
    height: 25,
  },
  ranking_list: {
    paddingHorizontal: 15,
  },
  ranking_item_tit: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 7,
  },
  ranking_item_tit_txt: {
    color: '#ABADB5',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 17,
  },
  ranking_item1: {
    width: 46,
    flexShrink: 0,
  },
  ranking_item2: {
    flex: 1,
    flexDirection: 'row',
  },
  ranking_item3: {
    flex: 1,
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  ranking_item: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E1E3E6',
  },
  ranking_item_pic: {
    width: 27,
    height: 27,
    borderRadius: 27,
  },
  ranking_item_name: {
    color: '#000',
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 31,
    marginLeft: 8,
  },
  ranking_item_income: {
    color: '#333333',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 31,
  },
  ranking_item_rk: {
    width: 24,
    color: '#333333',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'DINAlternate-Bold',
    lineHeight: 31,
    textAlign: 'center',
  },
  ranking_item_icon: {
    width: 23,
    height: 31,
  },
});

export default RankList;
