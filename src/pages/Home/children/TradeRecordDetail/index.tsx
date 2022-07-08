import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  InteractionManager,
  RefreshControl,
  ScrollView,
  Text,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import {RouteProp} from '@react-navigation/core';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RootStackParamList} from '@/navigator/index';
import GlobalStyles from '@/assets/style/global';
import {dateTimeFormat, SCREEN_WIDTH, themeColor} from '@/utils/index';
import BgIcon from '@/assets/image/home/electronicBilling/bg.png';
import BoxBgIcon from '@/assets/image/home/tradeRecordDetail/box-bg.png';
import {enstrustCommandDetail} from '@/api/trade';
import Loading from '@/components/Loading';

const boxWidth = SCREEN_WIDTH - 6;

interface IProps {
  route: RouteProp<RootStackParamList, 'TradeRecordDetail'>;
}

const enstrustStatusObj: any = {
  '-1': '待成交 ',
  '0': '待成交 ',
  '1': '部分成交',
  '2': '部分成交撤销',
  '3': '完全成交',
  '4': '已撤销',
};

const TradeRecordDetail: React.FC<IProps> = ({route}) => {
  const {id} = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails]: any = useState({});
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await enstrustCommandDetail(id);
      setDetails(data);
    } catch (error) {}
    setRefreshing(false);
  }, [id]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      try {
        const data = await enstrustCommandDetail(id);
        setDetails(data);
      } catch (error) {}
      setLoading(false);
    });
    return () => task.cancel();
  }, [id]);

  const isWtje = useMemo(
    () => details.type === '0' && details.direction === '0',
    [details.direction, details.type],
  );

  return (
    <View style={GlobalStyles.flex_1}>
      <StatusBar barStyle="light-content" />
      {loading ? (
        <Loading size="large" containerStyle={GlobalStyles.pt280} title="" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[GlobalStyles.flex_1, GlobalStyles.bg_fff]}
          refreshControl={
            <RefreshControl
              colors={[themeColor]}
              tintColor={themeColor}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          <Image style={styles.log_head} source={BgIcon} />
          <ImageBackground source={BoxBgIcon} style={styles.log_zt}>
            <View style={styles.log_jyd}>
              <Text style={styles.jyd_txt}>
                {details.symbol}/{details.toSymbol}
              </Text>
              <View
                style={[
                  styles.fx_box,
                  details.direction === '0'
                    ? GlobalStyles.up_bg_color
                    : GlobalStyles.down_bg_color,
                ]}>
                <Text style={styles.fx_txt}>
                  {details.direction === '0' ? '买入' : '卖出'}
                </Text>
              </View>
            </View>
            <Text style={styles.zt_txt}>
              {enstrustStatusObj[details.enstrustStatus]}
            </Text>
          </ImageBackground>
          <View style={styles.log_box}>
            <View style={styles.log_b_single}>
              <Text style={styles.bs_txt}>委托价</Text>
              <Text style={styles.bs_tit}>
                {details.type === '0'
                  ? '市价'
                  : details.price + ' ' + details.toSymbol}
              </Text>
            </View>
            <View style={styles.log_b_single}>
              <Text style={styles.bs_txt}>
                {isWtje ? '委托金额' : '委托数量'}
              </Text>
              <Text style={styles.bs_tit}>
                {isWtje ? details.totalAmount : details.totalCount}{' '}
                {isWtje ? details.toSymbol : details.symbol}
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.log_box}>
            <View style={styles.log_b_single}>
              <Text style={styles.bs_txt}>成交金额</Text>
              <Text style={styles.bs_tit}>
                {details.tradedAmount} {details.toSymbol}
              </Text>
            </View>
            <View style={styles.log_b_single}>
              <Text style={styles.bs_txt}>成交均价</Text>
              <Text style={styles.bs_tit}>
                {details.avgPrice} {details.toSymbol}
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.log_box}>
            <View style={styles.log_b_single}>
              <Text style={styles.bs_txt}>成交数量</Text>
              <Text style={styles.bs_tit}>
                {details.tradedCount} {details.symbol}
              </Text>
            </View>
            <View style={styles.log_b_single}>
              <Text style={styles.bs_txt}>手续费</Text>
              <Text style={styles.bs_tit}>
                {details.tradedFee} {details.feeSymbol}
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.log_con}>
            <Text style={styles.log_c_label}>成交明细</Text>
            {details.enstrustDetailList
              ? details.enstrustDetailList.map((item: any) => (
                  <View style={styles.lc_single} key={`mx_${item.id}`}>
                    <View style={styles.lcs_top}>
                      <View style={GlobalStyles.flex_1}>
                        <Text style={styles.cs_t_tit}>
                          成交价 ({details.toSymbol})
                        </Text>
                        <Text style={styles.cs_t_txt} numberOfLines={1}>
                          {item.tradedPrice}
                        </Text>
                      </View>
                      <View
                        style={[
                          GlobalStyles.flex_1,
                          GlobalStyles.flex_ai_center,
                        ]}>
                        <Text style={styles.cs_t_tit}>
                          成交量 ({details.symbol})
                        </Text>
                        <Text style={styles.cs_t_txt} numberOfLines={1}>
                          {item.tradedCount}
                        </Text>
                      </View>
                      <View
                        style={[GlobalStyles.flex_1, GlobalStyles.flex_ai_end]}>
                        <Text style={styles.cs_t_tit}>
                          手续费 ({details.feeSymbol})
                        </Text>
                        <Text style={styles.cs_t_txt} numberOfLines={1}>
                          {item.tradedFee}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cs_foo}>
                      {dateTimeFormat(+item.createTimestamp)}
                    </Text>
                  </View>
                ))
              : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  log_head: {
    height: 130 + getStatusBarHeight(),
    width: SCREEN_WIDTH,
  },
  log_zt: {
    marginTop: -45,
    width: boxWidth,
    height: 114,
    marginLeft: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  log_jyd: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  jyd_txt: {
    color: '#333333',
    fontSize: 22,
    lineHeight: 31,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
    marginRight: 4,
  },
  fx_box: {
    borderRadius: 2,
    width: 32,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fx_txt: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
  zt_txt: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
  log_box: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  log_b_single: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingBottom: 15,
    paddingTop: 15,
    borderColor: '#D8D8D8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bs_txt: {
    width: 96,
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
  },
  bs_tit: {
    flex: 1,
    color: '#333333',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'PingFangSC-Regular',
  },
  log_con: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  log_c_label: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  lc_single: {
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingTop: 17,
    paddingBottom: 13,
    paddingHorizontal: 15,
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
  lcs_top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  cs_t_tit: {
    color: '#A8ACBB',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    marginBottom: 4,
  },
  cs_t_txt: {
    color: '#333333',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  cs_foo: {
    color: '#C4C4C4',
    fontSize: 12,
    lineHeight: 13,
    fontFamily: 'PingFangSC-Regular',
  },
  line: {
    height: 12,
    backgroundColor: '#F0F0F0',
  },
});

export default TradeRecordDetail;
