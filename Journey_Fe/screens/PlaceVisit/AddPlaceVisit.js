import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView, Alert } from 'react-native';
import API, { endpoints } from '../../configs/API';
import { Provider as PaperProvider, Button} from 'react-native-paper';

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
    <PaperProvider>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Thêm điểm đến</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên điểm đến"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
            <Button mode="contained" onPress={searchLocation} style={styles.saveButton}>
            Tìm kiếm địa điểm              </Button>
      <TextInput
        style={styles.input}
        placeholder="Mô tả địa điểm"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      {location.lat && location.lon && (
        <Text style={styles.label}>Location: {location.lat}, {location.lon}</Text>
      )}
      {address && (
        <Text style={styles.label}>Address: {address}</Text>
      )}
      <Button mode="contained" onPress={addPlaceVisit} style={styles.saveButton}>
      Thêm địa điểm
              </Button>
      {placeVisit && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Thông tin điểm đến</Text>
           <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Tên điểm đến</Text>
            <Text style={styles.tableCell}>{placeVisit.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Địa chỉ</Text>
            <Text style={styles.tableCell}>{placeVisit.address}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Mô tả</Text>
            <Text style={styles.tableCell}>{placeVisit.description}</Text>
          </View>
        </View>
      )}
    </ScrollView>
    </PaperProvider>

  );
};

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 16,
    borderRadius: 5,
    
  },
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
