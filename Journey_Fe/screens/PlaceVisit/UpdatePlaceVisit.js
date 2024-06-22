import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView, Alert } from 'react-native';
import API, { endpoints } from '../../configs/API';
import { Provider as PaperProvider, Button } from 'react-native-paper';

const UpdatePlaceVisit = ({ route, navigation }) => {
  const { JourneyId } = route.params;
  const [placeVisits, setPlaceVisits] = useState([]);

  useEffect(() => {
    console.log('JourneyId:', JourneyId); // Log JourneyId
    fetchPlaceVisits();
  }, [JourneyId]);

  const fetchPlaceVisits = async () => {
    try {
      let res = await API.get(endpoints['place_visits'](JourneyId));
      console.log('API response:', res.data); // Log phản hồi API
      if (res.data && Array.isArray(res.data.results)) {
        setPlaceVisits(res.data.results);
      } else {
        console.error('Phản hồi API không chứa mảng results:', res.data);
        setPlaceVisits([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin địa điểm:', error);
      Alert.alert('Lỗi', 'Không thể tải các địa điểm. Vui lòng thử lại.');
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
        Alert.alert('Không tìm thấy địa điểm', 'Vui lòng thử lại với từ khóa khác.');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm địa điểm:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm địa điểm. Vui lòng thử lại.');
    }
  };

  const handleUpdate = async (id) => {
    const placeVisit = placeVisits.find(pv => pv.id === id);
    try {
      const response = await API.patch(`/place_visit/${id}`, placeVisit);
      if (response.status === 200) {
        Alert.alert('Thành công', 'Cập nhật địa điểm thành công');
        fetchPlaceVisits();  // Làm mới danh sách sau khi cập nhật
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật địa điểm. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật địa điểm:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật địa điểm. Vui lòng thử lại.');
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
        <Text style={styles.title}>Quản lý các điểm đến</Text>
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
        <Button mode="contained" onPress={() => navigation.navigate('UserJourneysScreen')} style={styles.searchButton}>
              Hoàn Thành
            </Button>
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
