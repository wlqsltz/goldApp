import React, {useRef} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import {createSelector} from 'reselect';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../models';
import IconFont from '@/assets/iconfont';
import BottomTabs from './BottomTabs';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ResetPwd from '@/pages/ResetPwd';
import CommonDetail from '@/pages/CommonDetail';
import Upgrade from '@/pages/Upgrade';
import ApiAuthorization from '@/pages/Home/children/ApiAuthorization';
import ChoseExchange from '@/pages/Home/children/ChoseExchange';
import BindApi from '@/pages/Home/children/BindApi';
import MessageDetail from '@/pages/Message/children/MessageDetail';
import CpsList from '@/pages/Home/children/CpsList';
import ElectronicBilling from '@/pages/Home/children/ElectronicBilling';
import HelpCenter from '@/pages/User/children/HelpCenter';
import AboutUs from '@/pages/User/children/AboutUs';
import VersionLog from '@/pages/User/children/VersionLog';
import AccountSecurity from '@/pages/User/children/AccountSecurity';
import EditMobile from '@/pages/User/children/EditMobile';
import EditLoginPwd from '@/pages/User/children/EditLoginPwd';
import EditTradePwd from '@/pages/User/children/EditTradePwd';
import Community from '@/pages/User/children/Community';
import Account from '@/pages/User/children/Account';
import BillList from '@/pages/User/children/BillList';
import BillDetail from '@/pages/User/children/BillDetail';
import Charge from '@/pages/User/children/Charge';
import ChargeList from '@/pages/User/children/ChargeList';
import Withdrawal from '@/pages/User/children/Withdrawal';
import TransferOrWithdrawalList from '@/pages/User/children/TransferOrWithdrawalList';
import Transfer from '@/pages/User/children/Transfer';
import Billing from '@/pages/Home/children/Billing';
import EverydayProfit from '@/pages/Home/children/EverydayProfit';
import SymbolsProfit from '@/pages/Home/children/SymbolsProfit';
import OnedayProfit from '@/pages/Home/children/OnedayProfit';
import TradeRecord from '@/pages/Home/children/TradeRecord';
import TradeRecordDetail from '@/pages/Home/children/TradeRecordDetail';
import OneSymbolProfit from '@/pages/Home/children/OneSymbolProfit';

export type RootStackParamList = {
  BottomTabs: {
    screen?: string;
  };
  ApiAuthorization: undefined;
  ElectronicBilling: undefined;
  Billing: undefined;
  EverydayProfit: {
    currency: string;
    totalIncome: string;
  };
  SymbolsProfit: undefined;
  OneSymbolProfit: {
    symbol: string;
    toSymbol: string;
    totalIncome: string;
    exchangeNo: string;
  };
  OnedayProfit: {
    currency: string;
    date: string;
    dayIncome: string;
  };
  TradeRecord: {
    date?: string;
    symbol?: string;
    toSymbol?: string;
  };
  TradeRecordDetail: {
    id: string;
  };
  CpsList: undefined;
  ChoseExchange: undefined;
  BindApi: {
    id?: string;
    exchangeNo?: string;
    from?: string;
  };
  MessageDetail: {
    message: IMessage;
  };
  HelpCenter: undefined;
  AboutUs: undefined;
  VersionLog: undefined;
  AccountSecurity: undefined;
  Community: {
    isChannel: string;
  };
  Account: undefined;
  BillList: undefined;
  BillDetail: {
    bill: IBill;
  };
  Charge: {
    accountNumber: string;
  };
  ChargeList: undefined;
  Withdrawal: undefined;
  Transfer: undefined;
  TransferOrWithdrawalList: {
    type: string;
  };
  EditMobile: {
    mobile?: string;
  };
  EditLoginPwd: {
    mobile?: string;
  };
  EditTradePwd: {
    mobile?: string;
    pwdFlag: boolean;
  };
  Login: undefined;
  Register: undefined;
  ResetPwd: undefined;
  Upgrade: undefined;
  CommonDetail: {
    title: string;
    content: string;
  };
};

export type RootStackNavigation = StackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

const selectUser = createSelector(
  (state: RootState) => state.user,
  user => ({user: user.user, userLoaded: user.loaded}),
);

export default function App() {
  const dispatch = useDispatch();
  const first = useRef(true);
  const {user, userLoaded} = useSelector(selectUser);
  if (!userLoaded) {
    // TODO splash
    return null;
  }
  if (user && first.current) {
    first.current = false;
    // 更新用户数据
    dispatch({
      type: 'user/getUserDetail',
    });
    // 用户绑定apikeylist
    dispatch({
      type: 'user/getExchangeApiKey',
    });
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...Platform.select({
            android: {
              headerStatusBarHeight: StatusBar.currentHeight,
            },
          }),
          headerBackTitleVisible: false,
          headerTintColor: '#333',
          headerBackImage: ({tintColor}) => (
            <IconFont
              style={styles.header_back_image}
              name="icon-fanhui"
              size={24}
              color={tintColor}
            />
          ),
          headerStyle: {
            borderBottomWidth: 0,
            shadowOpacity: 0,
            ...Platform.select({
              android: {
                elevation: 0,
              },
            }),
          },
        }}>
        {user ? (
          <>
            <Stack.Screen
              name="BottomTabs"
              component={BottomTabs}
              options={{
                headerTitle: '首页',
              }}
            />
            <Stack.Screen
              name="CpsList"
              component={CpsList}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ElectronicBilling"
              component={ElectronicBilling}
              options={{
                headerTitle: '电子账单',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="Billing"
              component={Billing}
              options={{
                headerTitle: '电子账单',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="EverydayProfit"
              component={EverydayProfit}
              options={{
                headerTitle: '每日盈利分布',
              }}
            />
            <Stack.Screen
              name="SymbolsProfit"
              component={SymbolsProfit}
              options={{
                headerTitle: '币对盈利分布',
              }}
            />
            <Stack.Screen
              name="OneSymbolProfit"
              component={OneSymbolProfit}
              options={{
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="OnedayProfit"
              component={OnedayProfit}
              options={{
                headerTitle: '电子账单',
              }}
            />
            <Stack.Screen
              name="TradeRecord"
              component={TradeRecord}
              options={{
                headerTitle: '交易记录',
              }}
            />
            <Stack.Screen
              name="TradeRecordDetail"
              component={TradeRecordDetail}
              options={{
                headerTitle: '委托详情',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="ApiAuthorization"
              component={ApiAuthorization}
              options={{
                headerTitle: 'API授权',
              }}
            />
            <Stack.Screen
              name="ChoseExchange"
              component={ChoseExchange}
              options={{
                headerTitle: '选择交易所',
              }}
            />
            <Stack.Screen
              name="BindApi"
              component={BindApi}
              options={{
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="MessageDetail"
              component={MessageDetail}
              options={{
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="HelpCenter"
              component={HelpCenter}
              options={{
                headerTitle: '帮助中心',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="AboutUs"
              component={AboutUs}
              options={{
                headerTitle: '关于我们',
              }}
            />
            <Stack.Screen
              name="VersionLog"
              component={VersionLog}
              options={{
                headerTitle: '版本日志',
              }}
            />
            <Stack.Screen
              name="AccountSecurity"
              component={AccountSecurity}
              options={{
                headerTitle: '安全设置',
              }}
            />
            <Stack.Screen
              name="Community"
              component={Community}
              options={{
                headerTitle: '我的社群',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="Account"
              component={Account}
              options={{
                headerTitle: '佣金钱包',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="BillList"
              component={BillList}
              options={{
                headerTitle: '账户流水',
              }}
            />
            <Stack.Screen
              name="BillDetail"
              component={BillDetail}
              options={{
                headerTitle: '明细详情',
                headerTransparent: true,
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="Charge"
              component={Charge}
              options={{
                headerTitle: '充币',
              }}
            />
            <Stack.Screen
              name="ChargeList"
              component={ChargeList}
              options={{
                headerTitle: '充币记录',
              }}
            />
            <Stack.Screen
              name="Withdrawal"
              component={Withdrawal}
              options={{
                headerTitle: '提币',
              }}
            />
            <Stack.Screen
              name="Transfer"
              component={Transfer}
              options={{
                headerTitle: '内部转账',
              }}
            />
            <Stack.Screen
              name="TransferOrWithdrawalList"
              component={TransferOrWithdrawalList}
              options={{
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="EditMobile"
              component={EditMobile}
              options={{
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="EditLoginPwd"
              component={EditLoginPwd}
              options={{
                headerTitle: '修改登录密码',
              }}
            />
            <Stack.Screen
              name="EditTradePwd"
              component={EditTradePwd}
              options={{
                headerTitle: '',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerTitle: '',
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="ResetPwd"
              component={ResetPwd}
              options={{
                headerTitle: '',
              }}
            />
          </>
        )}
        <Stack.Screen
          name="CommonDetail"
          component={CommonDetail}
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="Upgrade"
          component={Upgrade}
          options={{
            headerTitle: '',
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header_back_image: {
    // marginHorizontal: Platform.OS === 'android' ? 0 : 8,
    marginHorizontal: 8,
  },
});
