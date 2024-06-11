import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const JourneyItem = ({ item, goToJourneyDetail,handleAvatarPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => goToJourneyDetail(item.id)}>
    <View style={styles.header}>
      <TouchableOpacity  onPress={() => handleAvatarPress(item.user_journey.id)}>
        <Image source={{ uri: item.user_journey.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={styles.username}>{item.user_journey.username}</Text>
        <Text style={styles.time}>{moment(item.created_date).fromNow()}</Text>
      </View>
      <Icon name="ellipsis-h" size={20} color="#000" />
    </View>
    <Text style={styles.content}>{item.name}</Text>
    <Image source={{ uri: item.main_image }} style={styles.mainImage} />
    <Text>      Lượt thích            {item.comments_count} bình luận                 {item.join_count} tham gia </Text>
    <View style={styles.actions}>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="thumbs-up" size={20} color="#007BFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="comment" size={20} color="#007BFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="check" size={20} color="#007BFF" />
      </TouchableOpacity>
    </View> 
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
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
    color: '#666',
  },
  content: {
    marginBottom: 10,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#7B61FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default JourneyItem;
