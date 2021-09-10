import React, {useCallback, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootStackNavigation, RootStackParamList} from './index';
import {RouteProp, TabNavigationState} from '@react-navigation/native';
import HomeIcon from '@/assets/image/tabs/home.png';
import HomeActiveIcon from '@/assets/image/tabs/home_active.png';
import MarketIcon from '@/assets/image/tabs/market.png';
import MarketActiveIcon from '@/assets/image/tabs/market_active.png';
import StrategyIcon from '@/assets/image/tabs/strategy.png';
import StrategyActiveIcon from '@/assets/image/tabs/strategy_active.png';
import MessageIcon from '@/assets/image/tabs/message.png';
import MessageActiveIcon from '@/assets/image/tabs/message_active.png';
import UserIcon from '@/assets/image/tabs/user.png';
import UserActiveIcon from '@/assets/image/tabs/user_active.png';
import Home from '@/pages/Home';
import Market from '@/pages/Market';
import Strategy from '@/pages/Strategy';
import Message from '@/pages/Message';
import User from '@/pages/User';

export type BottomTabParamList = {
  Home: undefined;
  Market: undefined;
  Strategy: undefined;
  Message: undefined;
  User: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
type Route = RouteProp<RootStackParamList, 'BottomTabs'> & {
  state?: TabNavigationState<any>;
};

interface IProps {
  navigation: RootStackNavigation;
  route: Route;
}

function getHeaderTitle(routeName: string) {
  switch (routeName) {
    case 'Home':
      return '首页';
    case 'Market':
      return '行情';
    case 'Strategy':
      return '策略';
    case 'Message':
      return '消息';
    case 'User':
      return '我的';
    default:
      return '首页';
  }
}

const BottomTabs: React.FC<IProps> = ({navigation, route}) => {
  const setOptions = useCallback(() => {
    const routeName = route.state
      ? route.state?.routes[route.state.index]?.name
      : route.params?.screen || 'Home';
    if (routeName === 'Home') {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: false,
        headerTitle: getHeaderTitle(routeName),
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 23,
        },
        headerRight: () => null,
      });
    } else if (routeName === 'Message') {
      navigation.setOptions({
        headerShown: false,
      });
    } else if (routeName === 'User') {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerRight: () => null,
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: false,
        headerTitleAlign: 'left',
        headerTitle: getHeaderTitle(routeName),
        headerTitleStyle: {
          fontSize: 23,
        },
        headerRight: () => null,
      });
    }
  }, [navigation, route.params?.screen, route.state]);

  useEffect(() => {
    setOptions();
  }, [setOptions]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#f86442',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.image}
              source={focused ? HomeActiveIcon : HomeIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={props => <Market {...props} rootNavigation={navigation} />}
        options={{
          tabBarLabel: '行情',
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.image}
              source={focused ? MarketActiveIcon : MarketIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Strategy"
        component={Strategy}
        options={{
          tabBarLabel: '策略',
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.image}
              source={focused ? StrategyActiveIcon : StrategyIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarLabel: '消息',
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.image}
              source={focused ? MessageActiveIcon : MessageIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.image}
              source={focused ? UserActiveIcon : UserIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 26,
    height: 26,
  },
});

export default BottomTabs;
