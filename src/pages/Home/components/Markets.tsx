import React, {useCallback, useRef} from 'react';
import {
  Animated,
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {RootState} from '@/models/index';
import {SCREEN_WIDTH} from '@/utils/index';
import Touchable from '@/components/Touchable';
import GlobalStyles from '@/assets/style/global';

interface IProps {}

const themeColor = '#D59420';
const itemWidth = (SCREEN_WIDTH - 30) / 3;

const selectMarketList = createSelector(
  (state: RootState) => state.home,
  home => home.marketList,
);

const Markets: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const marketList = useSelector(selectMarketList);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        dispatch({
          type: 'home/getMarkets',
        });
      });
      return () => task.cancel();
    }, [dispatch]),
  );

  const scrollX = useRef(new Animated.Value(0));
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX.current}}}],
    {
      useNativeDriver: true,
    },
  );

  const goKLine = useCallback((item: IMarket) => {
    console.log('goKLine', item);
  }, []);

  const diffLen = Math.max(marketList.length - 3, 0);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={handleScroll}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {marketList.map(item => (
          <Touchable
            key={item.id}
            onPress={() => goKLine(item)}
            style={[styles.item_container]}>
            <View style={styles.symbols_box}>
              <Text style={styles.symbols}>{item.exchangePair}</Text>
              <Text
                style={[
                  styles.percent,
                  +item.percent24h >= 0
                    ? GlobalStyles.up_color
                    : GlobalStyles.down_color,
                ]}>
                {+item.percent24h > 0 ? '+' : ''}
                {(+item.percent24h * 100).toFixed(2)}%
              </Text>
            </View>
            <Text
              style={[
                styles.last_price,
                +item.percent24h >= 0
                  ? GlobalStyles.up_color
                  : GlobalStyles.down_color,
              ]}>
              {item.lastPrice}
            </Text>
            <Text style={[styles.last_price_cny]}>
              ≈{item.lastPriceCny} CNY
            </Text>
          </Touchable>
        ))}
      </Animated.ScrollView>
      {diffLen > 0 ? (
        <View style={styles.scroll_bar_box}>
          <View style={styles.bar_box}>
            <Animated.View
              style={[
                styles.bar,
                {
                  transform: [
                    {
                      translateX: scrollX.current.interpolate({
                        inputRange: [0, diffLen * itemWidth],
                        outputRange: [0, 13],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingBottom: 4,
  },
  item_container: {
    width: itemWidth,
    paddingTop: 12,
  },
  symbols_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbols: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 12,
    color: '#333',
    lineHeight: 14,
  },
  percent: {
    marginLeft: 2,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 13,
  },
  last_price: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
    marginTop: 4,
  },
  last_price_cny: {
    fontSize: 11,
    color: '#A8ACBB',
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    lineHeight: 13,
    marginTop: 2,
  },
  scroll_bar_box: {
    marginTop: 15,
    alignItems: 'center',
  },
  bar_box: {
    width: 26,
    height: 2,
    backgroundColor: 'rgba(213, 148, 32, 0.3)',
  },
  bar: {
    width: 13,
    height: 2,
    backgroundColor: themeColor,
  },
});

export default Markets;
