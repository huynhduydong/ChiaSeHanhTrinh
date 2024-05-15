import React, {useState, useEffect} from 'react';
import {
    Text, 
    View,   
    FlatList,
    StyleSheet
} from 'react-native'
import API, { endpoints } from '../../configs/API';
import HTML from 'react-native-render-html';
const Home = () => {
    const [journeys, setJourneys] = useState([]);

    useEffect(() => {
      fetchJourneys();
    }, []);
    const fetchJourneys = async () => {
      try {
        const response =  await API.get(endpoints['journeys']);
       
        setJourneys(response.data);
      } catch (error) {
        console.error('Error fetching journeys:', error);
      }
    };
    const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <HTML source={{ html: item.description }} />
        {/* Add more fields here as needed */}
      </View>
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
      marginTop: 20,
      marginHorizontal: 10,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
export default Home