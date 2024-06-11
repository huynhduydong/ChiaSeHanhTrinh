import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JourneyDetailItem = ({ item, onEdit, onComplete, onCloseComments,commentsClosed,handleAvatarPress }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    };

    loadCurrentUser();
  }, []);
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <TouchableOpacity  onPress={() => handleAvatarPress(item.user_journey.id)}>
        <Image source={{uri: item.user_journey.avatar }} style={styles.avatar} />
      </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.username}>{item.user_journey.username}</Text>
            <Text style={styles.time}>{moment(item.created_date).fromNow()}</Text>
          </View>
          {currentUser && currentUser.id === item.user_journey.id && (
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="settings-outline" size={30} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>{item.name}</Text>
        <Card.Cover style={styles.image} source={{ uri: item.main_image }} />
        <Text>{item.description}</Text>
        <View style={styles.placeVisitsContainer}>
          {item.place_visits.length > 0 ? (
            item.place_visits.map(placeVisit => (
              <Card key={placeVisit.id} style={styles.placeVisitCard}>
                <Card.Content>
                  <Text style={styles.placeVisitName}>{placeVisit.name}</Text>
                  <Text style={styles.placeVisitDescription}>{placeVisit.description}</Text>
                  <Text style={styles.placeVisitLocation}>
                    Location: {placeVisit.latitude}, {placeVisit.longitude}
                  </Text>
                  <Text style={styles.placeVisitAddress}>Address: {placeVisit.address}</Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.noPlaceVisits}>No place visits available.</Text>
          )}
        </View>
        <View style={styles.imagesContainer}>
          {item.images.length > 0 ? (
            item.images.map(image => (
              <Card key={image.id} style={styles.imageCard}>
                <Card.Content>
                  <Text>{image.content}</Text>
                  <Image source={{ uri: image.image }} style={styles.image} />
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text>No images available.</Text>
          )}
        </View>
      </Card.Content>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn hành động</Text>
          <Button 
            mode="contained" 
            onPress={() => { onEdit(item.id); toggleModal(); }} 
            style={styles.modalButton} 
            labelStyle={styles.buttonText}
          >
            Chỉnh sửa hành trình
          </Button>
          <Button 
            mode="contained" 
            onPress={() => { onComplete(item.id); toggleModal(); }} 
            style={styles.modalButton} 
            labelStyle={styles.buttonText}
          >
            Kết thúc hành trình
          </Button>
          
          {!commentsClosed && (
                    <Button 
                    mode="contained" 
                    onPress={() => { onCloseComments(item.id); toggleModal(); }} 
                    style={styles.modalButton} 
                    labelStyle={styles.buttonText}
                  >
                    Đóng bình luận
                  </Button>
                  )}
          <Button 
            mode="contained" 
            onPress={toggleModal} 
            style={styles.modalButton} 
            labelStyle={styles.buttonText}
          >
            Đóng
          </Button>
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 10,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  time: {
    color: '#777',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  placeVisitsContainer: {
    marginTop: 20,
  },
  placeVisitCard: {
    marginBottom: 10,
  },
  placeVisitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeVisitDescription: {
    fontSize: 14,
    color: '#555',
  },
  placeVisitLocation: {
    fontSize: 12,
    color: '#333',
  },
  placeVisitAddress: {
    fontSize: 12,
    color: '#333',
  },
  imagesContainer: {
    marginTop: 20,
  },
  imageCard: {
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: 'white',
  },
});

export default JourneyDetailItem;
