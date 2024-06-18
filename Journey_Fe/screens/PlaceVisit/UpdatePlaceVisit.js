import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView, Alert } from 'react-native';
import API, { endpoints } from '../../configs/API';
import { Provider as PaperProvider, Button } from 'react-native-paper';

const UpdatePlaceVisit = ({ route, navigation }) => {
  const { JourneyId } = route.params;
  const [placeVisits, setPlaceVisits] = useState([]);

  useEffect(() => {
    fetchPlaceVisits();
  }, [JourneyId]);

  const fetchPlaceVisits = async () => {
    try {
      let res = await API.get(endpoints['place_visits'](JourneyId));
      setPlaceVisits(res.data);
    } catch (error) {
      console.error('Error fetching place visits:', error);
      Alert.alert('Error', 'Failed to load place visits. Please try again.');
    }
  };

  const searchLocation = async (query, id) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        setPlaceVisits(prevPlaceVisits =>
          prevPlaceVisits.map(placeVisit =>
            placeVisit.id === id
              ? { ...placeVisit, latitude: parseFloat(result.lat).toFixed(6), longitude: parseFloat(result.lon).toFixed(6), address: result.display_name }
              : placeVisit
          )
        );
      } else {
        Alert.alert('Location not found', 'Please try another search query.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please try again.');
    }
  };

  const handleUpdate = async (id) => {
    const placeVisit = placeVisits.find(pv => pv.id === id);
    try {
      const response = await API.patch(`/place_visit/${id}`, placeVisit);
      if (response.status === 200) {
        Alert.alert('Success', 'Place visit updated successfully');
        fetchPlaceVisits();  // Refresh the list after update
      } else {
        Alert.alert('Error', 'Failed to update place visit. Please try again.');
      }
    } catch (error) {
      console.error('Error updating place visit:', error);
      Alert.alert('Error', 'Failed to update place visit. Please try again.');
    }
  };

  const handleInputChange = (id, field, value) => {
    setPlaceVisits(prevPlaceVisits =>
      prevPlaceVisits.map(placeVisit =>
        placeVisit.id === id ? { ...placeVisit, [field]: value } : placeVisit
      )
    );
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Manage Place Visits</Text>
        {placeVisits.map((placeVisit) => (
          <View key={placeVisit.id} style={styles.placeVisitContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tên điểm đến"
              value={placeVisit.name}
              onChangeText={(text) => handleInputChange(placeVisit.id, 'name', text)}
            />
            <Button mode="contained" onPress={() => searchLocation(placeVisit.name, placeVisit.id)} style={styles.searchButton}>
              Tìm kiếm địa điểm
            </Button>
            <TextInput
              style={styles.input}
              placeholder="Mô tả địa điểm"
              value={placeVisit.description}
              onChangeText={(text) => handleInputChange(placeVisit.id, 'description', text)}
            />
            <Text style={styles.label}>Location: {placeVisit.latitude}, {placeVisit.longitude}</Text>
            <Text style={styles.label}>Address: {placeVisit.address}</Text>
            <Button mode="contained" onPress={() => handleUpdate(placeVisit.id)} style={styles.updateButton}>
              Cập nhật địa điểm
            </Button>
          </View>
        ))}
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  placeVisitContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 4,
  },
  label: {
    color: '#333',
    marginBottom: 10,
  },
  searchButton: {
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 16,
    borderRadius: 5,
  },
});

export default UpdatePlaceVisit;
