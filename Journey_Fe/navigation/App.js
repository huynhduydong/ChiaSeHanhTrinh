
import React, {Component, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackRouter } from 'react-navigation'
import Welcome from '../screens/Welcome'
import JourneyList from '../screens/JourneyList/JourneyList'
import Home from '../screens/Home/Home'
import JourneyDetail from '../screens/JourneyList/JourneyDetail'
import AddJourney from '../screens/JourneyList/AddJourney'
import TempScreen from '../components/TempScreen'
import LoginScreen from '../screens/LoginScreen'

/**
 - Call API(Application Programming Interface)
 - POST, GET, PUT, DELETE
 - Postman(Postwoman)
 - find some public apis
 */


const Stack = createNativeStackNavigator()
function App(props) {
    return <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name={"JourneyList"} component={JourneyList}/>   
            <Stack.Screen name={"AddJourney"} component={AddJourney}/>  
            <Stack.Screen name={"TempScreen"} component={TempScreen}/>  
            <Stack.Screen name={"LoginScreen"} component={LoginScreen}/>  

            <Stack.Screen name={"JourneyDetail"} component={JourneyDetail}/>
      
        </Stack.Navigator>
    </NavigationContainer>
}
export default App