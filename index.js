/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import 'react-native-gesture-handler';
import App from './src';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
