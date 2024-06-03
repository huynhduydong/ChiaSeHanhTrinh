import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Map = ({ initialQuery = 'Hà Nội', initialLocation = { lat: 21.0283334, lon: 105.854041 }, onLocationFound }) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const debounceTimeout = useRef(null);

  const searchLocation = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const addr = data[0].display_name;
        const newLocation = { lat, lon };

        setLocation(newLocation);
        setAddress(addr);
        
        // Lưu vào AsyncStorage
        await AsyncStorage.setItem('location', JSON.stringify({ lat, lon, address: addr }));

        if (onLocationFound) {
          onLocationFound(newLocation, addr);
        }
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadLocation = async () => {
    try {
      const locationData = await AsyncStorage.getItem('location');
      if (locationData) {
        const { lat, lon, address } = JSON.parse(locationData);
        setLocation({ lat, lon });
        setAddress(address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLocation();
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      searchLocation();
    }, 2000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  return (
    <View style={styles.mapContainer}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
  
      <View style={styles.infoContainer}>
        <Text>Latitude: {location.lat}</Text>
        <Text>Longitude: {location.lon}</Text>
        <Text>Address: {address}</Text>
      </View>
      <Button
        title="Confirm"
        onPress={() => console.log("Location Confirmed:", location)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    padding: 10,
    height: 500,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  webview: {
    height: 400,
  },
  infoContainer: {
    marginTop: 10,
  },
});

export default Map;
