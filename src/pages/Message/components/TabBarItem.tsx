import React, {useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Touchable from '@/components/Touchable';

const themeColor = '#D59420';

interface IProps {
  activeIndex: number;
  index: number;
  unReadCount: number;
  title: string;
  tabClick: (index: number) => void;
}

const TabBarItem: React.FC<IProps> = ({
  activeIndex,
  index,
  unReadCount,
  title,
  tabClick,
}) => {
  const handleClick = useCallback(() => {
    tabClick(index);
  }, [index, tabClick]);

  return (
    <Touchable style={styles.tabbar_item} onPress={handleClick}>
      <Text
        style={[
          styles.tabbar_title,
          activeIndex === index && styles.tabbar_title_active,
        ]}>
        {title}
      </Text>
      {unReadCount > 0 ? (
        <View
          style={[
            styles.tabbar_suffix,
            unReadCount === 1 && styles.tabbar_suffix_1,
          ]}>
          <Text style={styles.tabbar_suffix_txt}>
            {unReadCount < 100 ? unReadCount : '99+'}
          </Text>
        </View>
      ) : null}
      {activeIndex === index ? <View style={styles.indicator} /> : null}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  tabbar_item: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 35,
    paddingBottom: 10,
  },
  tabbar_title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#B7B7B7',
    lineHeight: 21,
    marginRight: 3,
  },
  tabbar_title_active: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 25,
  },
  tabbar_suffix: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    backgroundColor: '#E94B4B',
    borderRadius: 9,
  },
  tabbar_suffix_1: {
    paddingHorizontal: 6,
  },
  tabbar_suffix_txt: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 15,
  },
  indicator: {
    width: 26,
    height: 4,
    backgroundColor: themeColor,
    borderRadius: 4,
    position: 'absolute',
    bottom: 3,
    left: 3,
  },
});

export default TabBarItem;
