import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.back);
  const [uniqueId, setUniqueId] = useState(Math.random())
  const [photo, setPhoto] = useState(null)

  const camera = useRef();
  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const onCameraReady = () => {
    setIsPlaying(true)
  }
  const snap = async () => {
    if (camera.current) {
      let photo = await camera.current.takePictureAsync();
      setPhoto(photo)
      setIsPlaying(false)
    }
  }
  return (
    <View style={styles.container}>
      {photo ? <Image source={photo} style={{ width: 300, height: 300 }} /> :
        <Camera ref={camera} style={styles.camera} type={type} onCameraReady={onCameraReady}>
          <CountdownCircleTimer
            key={uniqueId}
            onComplete={snap}
            isPlaying={isPlaying}
            duration={3}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
          >
            {({ remainingTime }) => <Text style={{ color: 'red' }}>{remainingTime}</Text>}
          </CountdownCircleTimer>
        </Camera>}
      <TouchableOpacity onPress={() => {
        setUniqueId(Math.random())
        setIsPlaying(true)
        setPhoto(null)
      }}>
        <Text>Restart Timer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  camera: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
