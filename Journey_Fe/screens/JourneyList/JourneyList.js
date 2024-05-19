import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button
} from 'react-native';
import API, { endpoints } from '../../configs/API';

const JourneyList = ({ route, navigation }) => {
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      const response = await API.get(endpoints['journeys']);
      setJourneys(response.data);
    } catch (error) {
      console.error('Error fetching journeys:', error);
    }
  };

  const goToJourneyDetail = (JourneyId) => {
    navigation.navigate("JourneyDetail", { "JourneyId": JourneyId });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToJourneyDetail(item.id)}>
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={{ uri: item.main_image || 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/409808276_2136446710040143_4957388703891454700_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGkRobaUFCGL3eLId4b6Mo_FZp0t1X6XFEVmnS3VfpcUWxNFPmslVUO3TRGkc05PGgn_12pb6IiEk8-8npqV_Qg&_nc_ohc=A8Cm3wnYWO0Q7kNvgFDy9D0&_nc_ht=scontent.fsgn2-6.fna&oh=00_AYCIFdGDvTGJbyEzBJlwwI64xzTyo25kPpvdh5ZWOGeQOw&oe=664A35EB' }} // Placeholder image if URL is null
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.title}> Username Tác giả: {item.user_journey.username}</Text>
          <Text style={styles.title}>Tên tác giả: {item.user_journey.first_name} {item.user_journey.last_name}</Text>
          <TouchableOpacity style={styles.button} onPress={() => goToJourneyDetail(item.id)}>
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={journeys}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  item: {
    backgroundColor: '#EDE7F6',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
   image: {
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#7B61FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default JourneyList;
