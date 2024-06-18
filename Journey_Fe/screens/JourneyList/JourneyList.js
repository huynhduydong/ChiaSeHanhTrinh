import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import API, { endpoints } from '../../configs/API';
import JourneyItem from '../../components/JourneyItem';
import SearchJourney from '../../components/SearchJourney';
import styles from '../../constants/styles';

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

  const handleSearchResults = (results) => {
    setJourneys(results);
  };

  const goToJourneyDetail = (JourneyId) => {
    navigation.navigate("JourneyDetail", { "JourneyId": JourneyId });
  };

  const handleAvatarPress = (id) => {
    navigation.navigate("ProfileScreen", { "userId": id });
  };

  const handleLike = async (id) => {
    try {
      await API.post(endpoints['like'](id));
      setJourneys((prevJourneys) =>
        prevJourneys.map((journey) =>
          journey.id === id ? { ...journey, likes_count: journey.likes_count + 1 } : journey
        )
      );
    } catch (error) {
      console.error('Error liking the journey:', error);
    }
  };

  const handleComment = (id) => {
    navigation.navigate("JourneyComments", { "JourneyId": id });
  };

  const renderItem = ({ item }) => (
    <JourneyItem
      item={item}
      goToJourneyDetail={goToJourneyDetail}
      handleAvatarPress={handleAvatarPress}
      onLike={handleLike}
      onComment={handleComment}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={journeys}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<SearchJourney onSearchResults={handleSearchResults} />} // Add SearchJourney component
      />
    </View>
  );
};

export default JourneyList;
