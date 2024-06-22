import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import API, { endpoints } from '../../configs/API';
import JourneyItem from '../../components/JourneyItem';
import SearchJourney from '../../components/SearchJourney';
import styles from '../../constants/styles';

const JourneyList = ({ route, navigation }) => {
  const [journeys, setJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      fetchJourneys(currentPage);
    }
  }, [currentPage, isSearching]);

  const fetchJourneys = async (page) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await API.get(`${endpoints['journeys']}?page=${page}`);
      setJourneys((prevJourneys) => [...prevJourneys, ...response.data.results]);
      setTotalPages(Math.ceil(response.data.count / 6));  // Assuming 6 items per page
    } catch (error) {
      console.error('Error fetching journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results, totalResults) => {
    setIsSearching(true);
    setJourneys(results);
    setTotalPages(Math.ceil(totalResults / 6));
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
      // onLike={handleLike}
      onComment={handleComment}
    />
  );

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isSearching) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={journeys}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<SearchJourney onSearchResults={handleSearchResults} />}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default JourneyList;
