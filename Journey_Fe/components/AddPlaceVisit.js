import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import API, { endpoints } from '../configs/API';

const AddPlaceVisit = ({ route }) => {
  const { JourneyId } = route.params;
  const [query, setQuery] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState('');
  const [placeVisit, setPlaceVisit] = useState(null);

  useEffect(() => {
    console.log('Journey ID:', JourneyId);
  }, [JourneyId]);

  const searchLocation = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        setLocation({ lat: parseFloat(result.lat).toFixed(6), lon: parseFloat(result.lon).toFixed(6) }); // Làm tròn giá trị lat và lon
        setAddress(result.display_name);
      } else {
        Alert.alert('Location not found', 'Please try another search query.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please try again.');
    }
  };

  const addPlaceVisit = async () => {
    try {
      const response = await API.post(
        `/add_journey/${JourneyId}/add_place_visit/`,  // Sử dụng journeyId trong URL
        {
          name: query,
          description: description,
          latitude: location.lat,
          longitude: location.lon,
          address: address
        }
      );


      if (response.status === 201) {
        Alert.alert('Success', 'Place Visit added successfully');
        setQuery('');
        setDescription('');
        setLocation({ lat: null, lon: null });
        setAddress('');
        setPlaceVisit(response.data);
      } else {
        Alert.alert('Error', 'Failed to add Place Visit. Please try again.');
      }
    } catch (error) {
      console.error('Error adding Place Visit:', error);
      // Kiểm tra và hiển thị lỗi một cách chính xác
      if (error.response) {
        console.log(error.response.data);
        Alert.alert('Error', `Failed to add Place Visit. ${error.response.data.message || 'Please try again.'}`);
      } else {
        Alert.alert('Error', `Failed to add Place Visit. ${error.message}`);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.label}>Journey: {journey.name}</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Place Visit Name"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button title="Search Location" onPress={searchLocation} />
      {location.lat && location.lon && (
        <Text style={styles.label}>Location: {location.lat}, {location.lon}</Text>
      )}
      {address && (
        <Text style={styles.label}>Address: {address}</Text>
      )}
      <Button title="Add Place Visit" onPress={addPlaceVisit} />
      {placeVisit && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Place Visit Information</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Latitude</Text>
            <Text style={styles.tableCell}>{placeVisit.latitude}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Longitude</Text>
            <Text style={styles.tableCell}>{placeVisit.longitude}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Address</Text>
            <Text style={styles.tableCell}>{placeVisit.address}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>{placeVisit.description}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  infoContainer: {
    marginBottom: 20,
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
});

export default AddPlaceVisit;
