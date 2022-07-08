import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  StatusBar,
  ScrollView,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {useDispatch} from 'react-redux';
import HuobiBgIcon from '@/assets/image/home/apiAuthorization/huobi_bg.png';
import BianBgIcon from '@/assets/image/home/apiAuthorization/bian_bg.png';
import IconFont from '@/assets/iconfont';
import GlobalStyles from '@/assets/style/global';
import Touchable from '@/components/Touchable';
import {SCREEN_WIDTH, toast} from '@/utils/index';
import {createApiKeyLoadData, modifyApiKeyLoadData} from '@/api/user';
import {getSystemParams} from '@/api/public';
import Input from './components/Input';

const themeColor = '#D59420';
const bgWidth = SCREEN_WIDTH - 30;

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'BindApi'>;
}

export interface Values {
  accessKey: string;
  secretKey: string;
}

const typeData: Record<
  string,
  {
    keyName: string;
    title: string;
    bgImg: ImageSourcePropType;
    ckey: string;
    cvalue: string;
  }
> = {
  '1': {
    keyName: 'Access Key',
    title: '火币API授权',
    bgImg: HuobiBgIcon,
    ckey: 'huobi_apikey_textarea',
    cvalue: '如何查看火币API Key？',
  },
  '2': {
    keyName: 'API Key',
    title: '币安API授权',
    bgImg: BianBgIcon,
    ckey: 'bian_apikey_textarea',
    cvalue: '如何查看币安API Key？',
  },
};

const initialValues: Values = {
  accessKey: '',
  secretKey: '',
};

const BindApi: React.FC<IProps> = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {exchangeNo = '1', id, from} = route.params;
  const curData = useMemo(() => typeData[exchangeNo], [exchangeNo]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: curData.title,
    });
  }, [navigation, curData]);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        accessKey: Yup.string()
          .trim()
          .required('请输入' + curData.keyName),
        secretKey: Yup.string().trim().required('请输入Secret Key'),
      }),
    [curData],
  );

  const [loadingGuide, setLoadingGuide] = useState(false);
  const [guideContent, setGuideContent] = useState('');
  const getGuide = useCallback(async () => {
    if (guideContent) {
      return navigation.navigate('CommonDetail', {
        title: curData.cvalue,
        content: guideContent,
      });
    }
    setLoadingGuide(true);
    try {
      const data: any = await getSystemParams(curData.ckey);
      if (!data[curData.ckey]) {
        return toast('未查询到相关文章!');
      }
      setGuideContent(data[curData.ckey]);
      setLoadingGuide(false);
      navigation.navigate('CommonDetail', {
        title: curData.cvalue,
        content: data[curData.ckey],
      });
    } catch (error) {
      setLoadingGuide(false);
    }
  }, [curData.ckey, curData.cvalue, guideContent, navigation]);

  const [loading, setLoading] = useState(false);
  const onSubmit = useCallback(
    async (values: Values) => {
      let tipMsg = '';
      setLoading(true);
      try {
        if (id) {
          tipMsg = '修改成功';
          await modifyApiKeyLoadData({
            ...values,
            id,
            exchangeNoFlag: exchangeNo,
          });
        } else {
          tipMsg = '授权成功';
          await createApiKeyLoadData({
            ...values,
            exchangeNoFlag: exchangeNo,
          });
        }
        toast(tipMsg);
        dispatch({
          type: 'user/updateExchangeApiKey',
          callback: () => {
            if (from) {
              navigation.navigate(from as any);
            } else {
              navigation.goBack();
            }
          },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [dispatch, exchangeNo, id, navigation, from],
  );
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <ImageBackground style={styles.bg} source={curData.bgImg}>
          <View style={styles.title_box}>
            <IconFont name="icon-tip" size={18} color="#fff" />
            <Text style={styles.title}>您的API Key，我们仅用于</Text>
          </View>
          <Text style={styles.tip}>1.实施策略交易</Text>
          <Text style={styles.tip}>2.同步持仓和交易数据</Text>
          <Text style={styles.sub_tip}>不涉及划转/提币等敏感操作</Text>
        </ImageBackground>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}>
          {({handleSubmit}) => {
            return (
              <View style={GlobalStyles.flex_1}>
                <ScrollView
                  style={GlobalStyles.flex_1}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag">
                  <Field
                    name="accessKey"
                    title={curData.keyName}
                    placeholder={`请输入${curData.keyName}`}
                    component={Input}
                  />
                  <Field
                    name="secretKey"
                    title="Secret Key"
                    placeholder="请输入Secret Key"
                    component={Input}
                  />
                  <Touchable onPress={getGuide} style={styles.detail_tip_box}>
                    <Text style={styles.detail_tip}>{curData.cvalue}</Text>
                  </Touchable>
                </ScrollView>
                <Touchable
                  disabled={loading}
                  style={styles.bottom}
                  onPress={handleSubmit}>
                  <View style={styles.btn}>
                    <Text style={styles.btn_txt}>确认授权</Text>
                  </View>
                </Touchable>
              </View>
            );
          }}
        </Formik>
        {loadingGuide ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    marginHorizontal: 15,
    marginBottom: 3,
    width: bgWidth,
    height: 154,
    paddingHorizontal: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  title_box: {
    marginTop: 19,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 24,
    marginLeft: 5,
  },
  tip: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#fff',
    lineHeight: 23,
  },
  sub_tip: {
    marginTop: 16,
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD99A',
    lineHeight: 24,
  },
  detail_tip_box: {
    marginTop: 34,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detail_tip: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#AB7007',
    lineHeight: 19,
  },
  bottom: {
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#e6e6e6',
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: ifIphoneX(40, 20),
  },
  btn: {
    height: 50,
    backgroundColor: themeColor,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_txt: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  },
});

export default BindApi;
