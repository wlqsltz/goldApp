import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {RootSiblingParent} from 'react-native-root-siblings';
import store from '@/config/dva';
import '@/config/http';
import Navigator from './navigator';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <Navigator />
      </RootSiblingParent>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
    </Provider>
  );
};

export default App;
