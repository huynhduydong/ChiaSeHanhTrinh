import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JourneyList from '../screens/JourneyList/JourneyList';
import JourneyDetail from '../screens/JourneyList/JourneyDetail';
import AddJourney from '../screens/JourneyList/AddJourney';
import UserJourneysScreen from '../screens/JourneyList/UserJourneysScreen';
import UpdateJourney from '../screens/JourneyList/UpdateJourney';
import ProfileScreen from '../screens/User/ProfileScreen';
import PlaceVisitDetail from '../screens/PlaceVisit/PlaceVisitDetail';
import AddImageJourney from '../screens/ImageJourney/AddImageJourney';
import AddPlaceVisit from '../screens/PlaceVisit/AddPlaceVisit';
import UpdatePlaceVisit from '../screens/PlaceVisit/UpdatePlaceVisit';
import ScreenWrapper from '../components/ScreenWrapper';
import ImageJourneyDetail from '../screens/ImageJourney/ImageJourneyDetail';

const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JourneyList" component={JourneyList} />
      <Stack.Screen name="AddJourney">
        {props => (
          <ScreenWrapper>
            <AddJourney {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="AddPlaceVisit">
        {props => (
          <ScreenWrapper>
            <AddPlaceVisit {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="UserJourneysScreen">
        {props => (
          <ScreenWrapper>
            <UserJourneysScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="UpdateJourney">
        {props => (
          <ScreenWrapper>
            <UpdateJourney {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="ProfileScreen">
        {props => (
          <ScreenWrapper>
            <ProfileScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="PlaceVisitDetail">
        {props => (
          <ScreenWrapper>
            <PlaceVisitDetail {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="AddImageJourney">
        {props => (
          <ScreenWrapper>
            <AddImageJourney {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="ImageJourneyDetail">
        {props => (
          <ScreenWrapper>
            <ImageJourneyDetail {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="JourneyDetail">
        {props => (
          <ScreenWrapper>
            <JourneyDetail {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="UpdatePlaceVisit">
        {props => (
          <ScreenWrapper>
            <UpdatePlaceVisit {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
