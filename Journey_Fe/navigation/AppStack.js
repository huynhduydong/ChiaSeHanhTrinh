import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../constants/Color';
import Home from '../screens/Home';
import SingleChat from '../screens/Home/SingleChat';
import AllUser from '../screens/User/AllUser';
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator 
    screenOptions={{
      cardStyle :{ backgroundColor: COLORS.button},
      gestureEnabled: true,
      backgroundColor:COLORS.button,
      gestureDirection: 'horizontal',
    }}
    initialRouteName="Home" headerMode="none">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AllUser" component={AllUser} />
        <Stack.Screen name="SingleChat" component={SingleChat} /> 
    </Stack.Navigator>
  );
}
