import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import API, { endpoints } from '../../configs/API';
import HTML from 'react-native-render-html';

const JourneyDetail = ({ route }) => {
  const [journey, setJourney] = useState(null);
  const { JourneyId } = route.params;

  useEffect(() => {
    const loadJourney = async () => {
      try {
        let res = await API.get(endpoints['journeys_detail'](JourneyId));
        setJourney(res.data);
      } catch (ex) {
        console.error(ex);
      }
    };
    loadJourney();
  }, [JourneyId]);

  if (!journey) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: journey.main_image || 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/409808276_2136446710040143_4957388703891454700_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGkRobaUFCGL3eLId4b6Mo_FZp0t1X6XFEVmnS3VfpcUWxNFPmslVUO3TRGkc05PGgn_12pb6IiEk8-8npqV_Qg&_nc_ohc=A8Cm3wnYWO0Q7kNvgFDy9D0&_nc_ht=scontent.fsgn2-6.fna&oh=00_AYCIFdGDvTGJbyEzBJlwwI64xzTyo25kPpvdh5ZWOGeQOw&oe=664A35EB' }} // Assuming each journey has an image_url field
      />
      <Text style={styles.title}>{journey.name}</Text>
      {journey.user_journey && (
        <View style={styles.userContainer}>
          <Text style={styles.subtitle}>Username: {journey.user_journey.username}</Text>
          <Text style={styles.subtitle}>Full Name: {journey.user_journey.first_name} {journey.user_journey.last_name}</Text>
        </View>
      )}
      <HTML contentWidth={Dimensions.get('window').width} source={{ html: journey.description }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default JourneyDetail;
