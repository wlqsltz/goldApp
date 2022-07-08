import React, {useEffect, useRef} from 'react';
import {Animated, Modal, StyleSheet, Text, View} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import Touchable from '../Touchable';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onRead: (data: string) => void;
}

const QrCodeCamera: React.FC<IProps> = ({visible, setVisible, onRead}) => {
  const onBarCodeRead = (event: BarCodeReadEvent) => {
    const {data} = event;
    onRead(data);
    setVisible(false);
  };
  const moveAnim = useRef(new Animated.Value(-200)).current;
  const loopRef = useRef<Animated.CompositeAnimation>();
  useEffect(() => {
    if (!visible) {
      loopRef.current?.stop();
    } else if (loopRef.current) {
      loopRef.current.reset();
      loopRef.current.start();
    } else {
      loopRef.current = Animated.loop(
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      );
    }
    return () => {
      loopRef.current?.stop();
    };
  }, [moveAnim, visible]);
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <RNCamera
        androidCameraPermissionOptions={{
          title: 'permissionCamera',
          message: 'permissionCameraMessage',
          buttonPositive: 'ok',
          buttonNegative: 'cancel',
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}>
        <Touchable
          style={styles.rectangleContainer}
          activeOpacity={1}
          onPress={() => {
            setVisible(false);
          }}>
          <Touchable
            style={styles.rectangle}
            activeOpacity={1}
            onPress={ev => {
              ev.stopPropagation();
            }}
          />
          <Animated.View
            style={[styles.border, {transform: [{translateY: moveAnim}]}]}
          />
          <Text style={styles.rectangleText}>
            将二维码放入框内，即可自动扫描
          </Text>
        </Touchable>
      </RNCamera>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
  },
  border: {
    flex: 0,
    width: 200,
    height: 2,
    backgroundColor: '#00FF00',
  },
});

export default QrCodeCamera;
