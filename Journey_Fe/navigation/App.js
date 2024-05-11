
import React, {Component, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackRouter } from 'react-navigation'
import Welcome from '../screens/Welcome'

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
            <Stack.Screen name={"Welcome"} component={Welcome}/>           
        </Stack.Navigator>
    </NavigationContainer>
}
export default App