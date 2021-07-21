import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
//
//let i=0;
let mLastFroce;
let SHAKE_TIMEOUT = 500;
let mShakeCount = 0;
let mLastTime=0;
let TIME_THRESHOLD = 100;
let mLastX = 1.0;
let mLastY = 1.0;
let mLastZ = 1.0;
let FORCE_THRESHOLD = 2000;
let SHAKE_COUNT = 2;
let SHAKE_DURATION = 350;
let mLastShake;
let jumpCount = 0;
export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;
  var now = Date.now();
  if ((now - mLastFroce) > SHAKE_TIMEOUT) {
    mShakeCount = 0;
  }
  if ((now - mLastTime) > TIME_THRESHOLD) {
              //jumpCount++;

    let diff = now - mLastTime;
    let speed = Math.abs(x + y + z - mLastX - mLastY - mLastZ)/diff*10000;
    if (speed > FORCE_THRESHOLD) {
      if ((++mShakeCount >= SHAKE_COUNT) && (now - mLastShake > SHAKE_DURATION)) {
        mLastShake = now;
        mShakeCount = 0;
        //if (true) {
          jumpCount++;
        //}
      }
      mLastForce = now;

    }
    mLastTime = now;
    mLastX = x;
    mLastY = y;
    mLastZ = z;
  }
  //var now = d.getMilliseconds();
  //i++;
  console.log(Math.abs(x + y + z - mLastX - mLastY - mLastZ)/(now - mLastTime)*10000);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <Text style={styles.text}>
      jumpCount:{jumpCount} 
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
