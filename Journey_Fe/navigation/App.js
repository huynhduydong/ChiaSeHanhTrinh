import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JourneyList from '../screens/JourneyList/JourneyList';
import JourneyDetail from '../screens/JourneyList/JourneyDetail';
import AddJourney from '../screens/JourneyList/AddJourney';
import TempScreen from '../components/TempScreen';
import LoginScreen from '../screens/LoginScreen';
import UserJourneysScreen from '../screens/JourneyList/UserJourneysScreen';
import UpdateJourney from '../screens/JourneyList/UpdateJourney';
import ActivityLog from '../screens/ActivityLog';
import { MyProvider, MyContext } from '../configs/MyContext';
import AddPlaceVisit from '../components/AddPlaceVisit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator  screenOptions={{
      headerShown: false,
    }}>
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

function AppTabs() {
  const { isLoggedIn } = useContext(MyContext);

  return (
    <Tab.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={MainStackNavigator} />
      <Tab.Screen name="AddJourney" component={AddJourney} />
      <Tab.Screen name="UserJourneys" component={UserJourneysScreen} />
      {!isLoggedIn && <Tab.Screen name="LoginScreen" component={LoginScreen} />}
      <Tab.Screen name="ActivityLog" component={ActivityLog} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <MyProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </MyProvider>
  );
}

export default App;
