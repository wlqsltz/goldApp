import React, {useLayoutEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {RouteProp} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'CommonDetail'>;
}

const CommonDetail: React.FC<IProps> = ({navigation, route}) => {
  const {title, content} = route.params;
  const source = useMemo(() => {
    return {
      html:
        '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,user-scalable=yes" />' +
        content.replace('<img', '<img height="auto" width="100%"'),
    };
  }, [content]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <WebView
        startInLoadingState
        source={source}
        mixedContentMode="always"
        scalesPageToFit={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
});

export default CommonDetail;
