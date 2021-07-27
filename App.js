import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
//
//let i=0;
// let mLastFroce; //ok
// let SHAKE_TIMEOUT = 500; //ok
// let mShakeCount = 0; //ok
// let mLastTime; //ok
// let TIME_THRESHOLD = 100; //ok
// let mLastX = -1.0; //ok
// let mLastY = -1.0; //ok
// let mLastZ = -1.0; //ok
// let FORCE_THRESHOLD = 2000; //ok
// let SHAKE_COUNT = 2; //ok
// let SHAKE_DURATION = 350; //ok
// let mLastShake; //ok
// let jumpCount = 0; //ok

export default function App() {

  const [speed,setSpeed] = useState(0);
  const [mLastShake,setmLastShake] = useState(0);
  const [SHAKE_DURATION,setSHAKE_DURATION] = useState(400);
  const [SHAKE_COUNT,setSHAKE_COUNT] = useState(2);
  const [FORCE_THRESHOLD,setFORCE_THRESHOLD] = useState(1500);
  const [mLastZ,setmLastZ] = useState(1.0);
  const [mLastY,setmLastY] = useState(1.0);
  const [mLastX,setmLastX] = useState(1.0);
  const [mLastTime,setmLastTime] = useState(0);
  const [TIME_THRESHOLD,setjumpTIME_THRESHOLD] = useState(100);
  const [mLastFroce,setmLastFroce] = useState(0);
  const [SHAKE_TIMEOUT,setSHAKE_TIMEOUT] = useState(500);
  let [mShakeCount,setmShakeCount] = useState(0);
  let [jumpCount,setjump] = useState(0);
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
        // console.log(accelerometerData);
        setData(accelerometerData);
        const { x, y, z } = data; 
        // console.log(x,y,z);

        var now = Date.now();
        if ((now - mLastFroce) > SHAKE_TIMEOUT) {
          // console.log('first if')
          setmShakeCount(0);
        }
        if ((now - mLastTime) > TIME_THRESHOLD) {
          // console.log('2nd if') 

          let diff = now - mLastTime;
          let speed = Math.abs(x + y + z - mLastX - mLastY - mLastZ) / diff * 1000000000000000;
          setSpeed(speed);
          // console.log(speed,FORCE_THRESHOLD); 
          if (speed > FORCE_THRESHOLD) {
            // console.log(now - mLastShake)
            setmShakeCount(++mShakeCount);
            // console.log(mShakeCount)
            if ( (mShakeCount >= SHAKE_COUNT) && (now - mLastShake > SHAKE_DURATION)) {
              console.log('4th if')
              setmLastShake(now);
              setmShakeCount(0);
              // if (true) {
              setjump(jumpCount++);
              // }
            }
            setmLastFroce(now);

          }
          setmLastTime(now);
          setmLastX(x);
          setmLastY(y);
          setmLastZ(z);
        }
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
  // const { x, y, z } = data;
  //var now = d.getMilliseconds();
  //i++;
  // console.log(Math.abs(x + y + z - mLastX - mLastY - mLastZ)/(now - mLastTime)*10000);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
      <Text style={styles.text}>
        speed:{speed}
      </Text>
      <Text style={styles.text}>
        mShakeCount:{mShakeCount}
      </Text>
      <Text style={styles.text}>
      now - mLastShake:{Date.now() - mLastShake}
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
