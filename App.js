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

  // var now = Date.now();
  // const [now,setNow] = useState(Date.now());
  // const [speed,setSpeed] = useState(0);
  // const [mLastShake,setmLastShake] = useState(0);
  const SHAKE_DURATION = 400;
  const SHAKE_COUNT = 2;
  const FORCE_THRESHOLD = 2000;
  // const [mLastZ,setmLastZ] = useState(0);
  // const [mLastY,setmLastY] = useState(0);
  // const [mLastX,setmLastX] = useState(0);
  // let [mLastTime,setmLastTime] = useState(0);
  const TIME_THRESHOLD = 100;
  // const [mLastFroce,setmLastFroce] = useState(0);
  const SHAKE_TIMEOUT = 500;
  // let [mShakeCount,setmShakeCount] = useState(0);
  let [jumpCount,setjump] = useState(0);
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(20);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(20);
  };

  const _subscribe = () => {
    let mLastTime = 0;
    let mLastX = -1.0;
    let mLastY = -1.0;
    let mLastZ = -1.0;
    let mShakeCount = 0;
    let mLastFroce = 0;
    let mLastShake = 0;

    setSubscription(
      
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
        const { x, y, z } = accelerometerData; 
  
        var now = Date.now();
 
        if ((now - mLastFroce) > SHAKE_TIMEOUT) {
           mShakeCount = 0;
        }

        if ((now - mLastTime) > TIME_THRESHOLD) {
          let diff = now - mLastTime;
          // console.log('diff',diff)
          // console.log('numerator:',Math.abs(x + y + z - mLastX - mLastY - mLastZ))
          let speed = Math.abs(x + y + z - mLastX - mLastY - mLastZ) / diff * 100000;

          // console.log('speed',speed); 
          if (speed > FORCE_THRESHOLD) {
            console.log(now-mLastShake)
            
            if ( (++mShakeCount >= SHAKE_COUNT) && (now - mLastShake > SHAKE_DURATION)) {
              console.log(mShakeCount)
              mLastShake = now;
              mShakeCount = 0;

              setjump(jumpCount++);
              console.log(jumpCount);

            }
            mLastFroce = now;

          }
          
          mLastTime = now;
          mLastX = x;
          mLastY = y;
          mLastZ = z;
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
      {/* <Text style={styles.text}>
        speed:{speed}
      </Text> */}
      {/* <Text style={styles.text}>
        mShakeCount:{mShakeCount}
      </Text> */}
      {/* <Text style={styles.text}>
      now - mLastShake:{Date.now() - mLastShake}
      </Text> */}
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
