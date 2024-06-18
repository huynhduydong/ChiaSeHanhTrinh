import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';
import styles from '../constants/styles';

const JourneyDetailItem = ({ item, onEdit, onComplete, onCloseComments, commentsClosed, handleAvatarPress, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await AsyncStorage.getItem('user');
      console.log(user);
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    };

    loadCurrentUser();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handlePlaceVisitPress = (placeVisit) => {
    navigation.navigate('PlaceVisitDetail', { placeVisit });
  };
  const handleImagePress = (imageId) => {
    navigation.navigate('ImageJourneyDetail', { imageJourneyId: imageId });
  };
  const onAddImage = (journeyId) => {
    navigation.navigate('AddImageJourney', { journeyId });

  }
  const isWithinDateRange = () => {
    const now = moment();
    return now.isBetween(item.start_date, item.end_date, null, '[]');
  };

  const canAddImage = () => {
    if (!currentUser) return false;
    const isOwner = currentUser.id === item.user_journey.id;
    const isParticipant = item.joinedUsers && item.joinedUsers.includes(currentUser.id);
    return (isOwner || isParticipant) ;
  };  

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleAvatarPress(item.user_journey.id)}>
            <Image source={{ uri: item.user_journey.avatar }} style={styles.avatar} />
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
        <HTML contentWidth={Dimensions.get('window').width} source={{ html: item.description }} />
        <View style={styles.placeVisitsContainer}>
          <Text style={styles.placeVisitName}>Danh sách điểm đến trong hành trình: </Text>
          {item.place_visits.length > 0 ? (
            item.place_visits.map(placeVisit => (
              <TouchableOpacity key={placeVisit.id} onPress={() => handlePlaceVisitPress(placeVisit)}>
                <Card style={styles.placeVisitCard}>
                  <Card.Content>
                    <Text style={styles.placeVisitName}>Địa điểm: {placeVisit.name}</Text>
                    <Text style={styles.placeVisitDescription}>Mô tả: {placeVisit.description}</Text>
                    <Text style={styles.placeVisitAddress}>Địa chỉ: {placeVisit.address}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPlaceVisits}>Không có chuyến thăm địa điểm có sẵn.</Text>
          )}
        </View>
        <View style={styles.imagesContainer}>
          <Text style={styles.placeVisitName}>Hình ảnh đẹp trong hành trình: </Text>
          {item.images.length > 0 ? (
            item.images.map(image => (
              <TouchableOpacity key={image.id} onPress={() => handleImagePress(image.id)}>
                <Card style={styles.imageCard}>
                  <Card.Content>
                    <Text>{image.content}</Text>
                    <Image source={{ uri: image.image }} style={styles.image} />
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Không có hình ảnh có sẵn</Text>
          )}
        </View>
        {canAddImage() && (
          <Button mode="contained" onPress={() => onAddImage(item.id)}  style={styles.addButton}
          labelStyle={styles.addButtonText} >
            Thêm hình ảnh của hành trình
          </Button>
        )}
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

export default JourneyDetailItem;