import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { fontSizes, spacing } from './src/utils/sizes';
import { colors } from './src/utils/colors';
import { Timer } from './src/features/timer/Timer';
import { useKeepAwake } from 'expo-keep-awake';
import {FocusHistory} from './src/features/focus/FocusHistory';


const STATUSES ={
  complete:1,
  canceled:2
}
export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);
  
 const addFocusHistorySubjectWithStatus = (subject, status) => {
   setFocusHistory([...focusHistory,{key:String(focusHistory.length+1),subject, status}]);
 };

  const onClear = () => {
      setFocusHistory([]);
  }

  const saveFocusHistory = async () => {
    try{
await AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory));
    } catch(e){
      console.log(e);
    }
  }

  const loadFocusHistory = async () => {
    try{
     const history= await AsyncStorage.getItem("focusHistory");

     if(history && JSON.parse(history).length){
       setFocusHistory(JSON.parse(history));
     }
    } catch(e){
      console.log(e);
    }
  }
  useEffect(() => {
    loadFocusHistory();
  }, []);
  useEffect(() => {
    saveFocusHistory();
  },[focusHistory]);


  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.complete)
            setFocusSubject(null);
          }}
          clearSubject={()=> {
          addFocusHistorySubjectWithStatus(focusSubject,STATUSES.canceled);
          setFocusSubject(null)}
          }/>
      ) : (
        <View style={{flex:1}}>
        <Focus addSubject={setFocusSubject}/>
        <FocusHistory focusHistory={focusHistory} onClear={onClear}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sm,
    paddingTop: spacing.md,
    backgroundColor: colors.darkBlue,
  },
});
