import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import WebView from 'react-native-webview';

const PlaceVisitDetail = ({ route }) => {
  const { placeVisit } = route.params;

  // Tạo URL cho bản đồ
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${placeVisit.longitude}%2C${placeVisit.latitude}%2C${placeVisit.longitude}%2C${placeVisit.latitude}&layer=mapnik&marker=${placeVisit.latitude}%2C${placeVisit.longitude}`;

  console.log(mapUrl); // In ra URL bản đồ để kiểm tra

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tên địa điểm: {placeVisit.name}</Text>
      <Text style={styles.description}>Mô tả: {placeVisit.description}</Text>
      <Text style={styles.location}>
        Vĩ độ: {placeVisit.latitude}, Kinh độ: {placeVisit.longitude}
      </Text>
      <Text style={styles.address}>Địa chỉ: {placeVisit.address}</Text>
      
      <WebView
        style={styles.map}
        source={{ uri: mapUrl }}
      />
    </View>
  );
};

export default PlaceVisitDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f8ff',  // Màu nền xanh nhạt
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e90ff',  // Màu xanh dương đậm
    marginBottom: 16,
    textAlign: 'center',  // Căn giữa tiêu đề
  },
  description: {
    fontSize: 18,
    color: '#4682b4',  // Màu xanh dương trung bình
    marginBottom: 16,
    textAlign: 'center',  // Căn giữa mô tả
  },
  location: {
    fontSize: 16,
    color: '#5f9ea0',  // Màu xanh biển nhạt
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#5f9ea0',  // Màu xanh biển nhạt
    marginBottom: 16,
  },
  map: {
    flex: 1,  // Đảm bảo bản đồ chiếm toàn bộ không gian khả dụng
    width: Dimensions.get('window').width - 32,
    height: 400,
    borderRadius: 8,  // Bo góc bản đồ
    borderWidth: 1,  // Đường viền
    borderColor: '#ddd',  // Màu đường viền
    overflow: 'hidden',  // Ẩn phần dư thừa khi bo góc
  },
});
