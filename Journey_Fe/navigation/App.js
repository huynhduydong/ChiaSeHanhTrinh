import React, { useContext } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
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
import Register from '../screens/Register';
import { Provider } from 'react-native-paper';
import theme from '../constants/theme';
import ProfileScreen from '../screens/User/ProfileScreen';
import ProfileCurrentUser from '../screens/User/ProfileCurrentUser';
import AddPlaceVisit from '../screens/PlaceVisit/AddPlaceVisit';
import PlaceVisitDetail from '../screens/PlaceVisit/PlaceVisitDetail';
import AddImageJourney from '../screens/ImageJourney/AddImageJourney';
import UpdatePlaceVisit from '../screens/PlaceVisit/UpdatePlaceVisit';
import ImageJourneyDetail from '../screens/ImageJourney/ImageJourneyDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator({ navigation, route }) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'JourneyList';

  React.useLayoutEffect(() => {
    const hideOnScreens = [
      'AddJourney',
      'AddPlaceVisit',
      'UpdateJourney',
      'PlaceVisitDetail',
      'AddImageJourney',
      'JourneyDetail',
      'UpdatePlaceVisit',
      'ProfileScreen'
    ];
    if (hideOnScreens.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, routeName]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="JourneyList" component={JourneyList} options={{ headerShown: false }} />
      <Stack.Screen name="AddJourney" component={AddJourney} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="AddPlaceVisit" component={AddPlaceVisit} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="UserJourneysScreen" component={UserJourneysScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateJourney" component={UpdateJourney} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="PlaceVisitDetail" component={PlaceVisitDetail} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="AddImageJourney" component={AddImageJourney} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="JourneyDetail" component={JourneyDetail} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="UpdatePlaceVisit" component={UpdatePlaceVisit} options={{ headerTitle: '', headerBackTitleVisible: false }} />
      <Stack.Screen name="ImageJourneyDetail" component={ImageJourneyDetail} options={{ headerTitle: '', headerBackTitleVisible: false }} />
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
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
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
      <Tab.Screen name="Profile" component={ProfileCurrentUser} />
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
