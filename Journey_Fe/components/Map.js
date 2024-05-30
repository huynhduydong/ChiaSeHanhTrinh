import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Map = () => {
  const [query, setQuery] = useState('xã tam hiệp huyện núi thành tỉnh quảng nam');
  const [location, setLocation] = useState({ lat: 15.4234, lon: 108.7996 });
  const [address, setAddress] = useState('');

  const searchLocation = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const addr = data[0].display_name;
        setLocation({ lat, lon });
        setAddress(addr);
        
        // Lưu vào AsyncStorage
        await AsyncStorage.setItem('location', JSON.stringify({ lat, lon, address: addr }));
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

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        #map {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${location.lat}, ${location.lon}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([${location.lat}, ${location.lon}]).addTo(map)
          .bindPopup('${query}')
          .openPopup();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <Button
        title="Search"
        onPress={searchLocation}
      />
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
      />
      <View style={styles.infoContainer}>
        <Text>Latitude: {location.lat}</Text>
        <Text>Longitude: {location.lon}</Text>
        <Text>Address: {address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  webview: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 10,
  },
});

export default Map;
