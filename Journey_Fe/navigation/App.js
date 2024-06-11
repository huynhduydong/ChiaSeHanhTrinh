import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import JourneyList from '../screens/JourneyList/JourneyList';
import JourneyDetail from '../screens/JourneyList/JourneyDetail';
import AddJourney from '../screens/JourneyList/AddJourney';
import LoginScreen from '../screens/LoginScreen';
import UserJourneysScreen from '../screens/JourneyList/UserJourneysScreen';
import UpdateJourney from '../screens/JourneyList/UpdateJourney';
import ActivityLog from '../screens/ActivityLog';
import { MyProvider, MyContext } from '../configs/MyContext';
import AddPlaceVisit from '../components/AddPlaceVisit';
import Register from '../screens/Register';
import { Provider } from 'react-native-paper';
import theme from '../constants/theme';
import ProfileScreen from '../screens/User/ProfileScreen';
import ProfileCurrentUser from '../screens/User/ProfileCurrentUser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JourneyList" component={JourneyList} />
      <Stack.Screen name="AddJourney" component={AddJourney} />
      <Stack.Screen name="AddPlaceVisit" component={AddPlaceVisit} />
      <Stack.Screen name="UserJourneysScreen" component={UserJourneysScreen} />
      <Stack.Screen name="UpdateJourney" component={UpdateJourney} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      <Stack.Screen name="JourneyDetail" component={JourneyDetail} />
    </Stack.Navigator>
  );
}

function LoginMain() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const { isLoggedIn } = useContext(MyContext);

  return (
    <Tab.Navigator
      initialRouteName={isLoggedIn ? "Home" : "LoginMain"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { display: route.name === 'LoginMain' ? 'none' : 'flex' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AddJourney') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'UserJourneys') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'LoginMain') {
            iconName = focused ? 'log-in' : 'log-in-outline';
          } else if (route.name === 'ActivityLog') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={MainStackNavigator} />
      <Tab.Screen name="AddJourney" component={AddJourney} />
      <Tab.Screen name="UserJourneys" component={UserJourneysScreen} />
      {!isLoggedIn && <Tab.Screen name="LoginMain" component={LoginMain} />}
      <Tab.Screen name="ActivityLog" component={ActivityLog} />
      <Tab.Screen name="ProfileCurrentUser" component={ProfileCurrentUser} />

    </Tab.Navigator>
  );
}

function App() {
  return (
    <MyProvider>
      <Provider theme={theme}>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </Provider>
    </MyProvider>
  );
}

export default App;
