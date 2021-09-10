import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {StyleSheet, View, Image, InteractionManager} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SnapCarousel, {Pagination} from 'react-native-snap-carousel';
import {createSelector} from 'reselect';
import {RootState} from '@/models/index';
import {ICarousel} from '@/models/home';
import {delImgQuality, SCREEN_WIDTH} from '@/utils/index';

interface IProps {}
const themeColor = '#D59420';

const itemWidth = SCREEN_WIDTH - 30;

const selectCarouselList = createSelector(
  (state: RootState) => state.home,
  home => home.carouselList,
);

const Carousel: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const carouselList = useSelector(selectCarouselList);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch({
        type: 'home/getCarousels',
      });
    });
    return () => task.cancel();
  }, [dispatch]);

  const renderItem = useCallback(({item}: {item: ICarousel}) => {
    return (
      <Image
        source={{uri: delImgQuality(item.pic.trim(), 30, 45)}}
        style={styles.image}
      />
    );
  }, []);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const onSnapToItem = (index: number) => {
    setActiveCarouselIndex(index);
  };
  const pagination = useMemo(
    () => (
      <View style={styles.pagination_wrapper}>
        <Pagination
          containerStyle={styles.pagination_container}
          dotContainerStyle={styles.dot_container}
          dotStyle={styles.dot}
          inactiveDotStyle={[styles.dot, styles.dot_inactive]}
          activeDotIndex={activeCarouselIndex}
          dotsLength={carouselList.length}
          inactiveDotScale={1}
          inactiveDotOpacity={1}
        />
      </View>
    ),
    [carouselList, activeCarouselIndex],
  );

  return (
    <View style={styles.container}>
      <SnapCarousel
        data={carouselList}
        renderItem={renderItem}
        sliderWidth={itemWidth}
        itemWidth={itemWidth}
        onSnapToItem={onSnapToItem}
        loop
        autoplay
        autoplayDelay={3000}
        autoplayInterval={3000}
      />
      {pagination}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingTop: 6,
  },
  image: {
    width: '100%',
    height: 119,
    resizeMode: 'stretch',
    borderRadius: 6,
  },
  pagination_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination_container: {
    position: 'absolute',
    top: -16,
    paddingHorizontal: 3,
    paddingVertical: 4,
  },
  dot_container: {
    marginHorizontal: 6,
  },
  dot: {
    width: 12,
    height: 3,
    backgroundColor: themeColor,
  },
  dot_inactive: {
    backgroundColor: 'rgba(213, 148, 32, 0.3)',
  },
});

export default Carousel;
