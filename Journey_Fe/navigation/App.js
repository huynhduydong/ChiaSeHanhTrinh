import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../screens/Welcome';
import JourneyList from '../screens/JourneyList/JourneyList';
import Home from '../screens/Home/Home';
import JourneyDetail from '../screens/JourneyList/JourneyDetail';
import AddJourney from '../screens/JourneyList/AddJourney';
import TempScreen from '../components/TempScreen';
import LoginScreen from '../screens/LoginScreen';
import UserJourneysScreen from '../screens/JourneyList/UserJourneysScreen';
import UpdateJourney from '../screens/JourneyList/UpdateJourney';
import Map from '../components/Map';
import ActivityLog from '../screens/ActivityLog';
import { MyProvider } from '../configs/MyContext';
import AddPlaceVisit from '../components/AddPlaceVisit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JourneyList" component={JourneyList} />
      <Stack.Screen name="AddJourney" component={AddJourney} />
      <Stack.Screen name="AddPlaceVisit" component={AddPlaceVisit} />
      <Stack.Screen name="TempScreen" component={TempScreen} />
      <Stack.Screen name="UserJourneysScreen" component={UserJourneysScreen} />
      <Stack.Screen name="UpdateJourney" component={UpdateJourney} />
      <Stack.Screen name="JourneyDetail" component={JourneyDetail} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <MyProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={MainStackNavigator} />
          <Tab.Screen name="AddJourney" component={AddJourney} />
          <Tab.Screen name="UserJourneys" component={UserJourneysScreen} />
          {/* <Tab.Screen name="AddPlaceVisit" component={AddPlaceVisit} /> */}
          <Tab.Screen name="LoginScreen" component={LoginScreen} />
          <Tab.Screen name="ActivityLog" component={ActivityLog} />
        </Tab.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
}

export default App;
