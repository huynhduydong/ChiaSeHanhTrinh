import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import styles from '../constants/styles';

const JourneyItem = ({ item, goToJourneyDetail, handleAvatarPress, onLike, onComment }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => goToJourneyDetail(item.id)}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => handleAvatarPress(item.user_journey.id)}>
        <Image source={{ uri: item.user_journey.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={styles.username}>{item.user_journey.username}</Text>
        <Text style={styles.time}>{moment(item.created_date).fromNow()}</Text>
      </View>
      <Icon name="ellipsis-h" size={20} color="#000" />
    </View>
    <Text style={styles.content}>{item.name}</Text>
    <Text>Ngày khởi hành: {moment(item.start_date).format('DD-MM-YYYY')}</Text>
    <Text>Ngày kết thúc: {moment(item.end_date).format('DD-MM-YYYY')}</Text>
    <Image source={{ uri: item.main_image }} style={styles.mainImage} />
    <Text>           {item.comments_count} bình luận                          {item.join_count} tham gia</Text>
    <View style={styles.actions}>
      {/* <TouchableOpacity onPress={onLike}>
        <Icon name="thumbs-up" size={20} color="#007BFF" />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onComment}>
        <Icon name="comment" size={20} color="#007BFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="check" size={20} color="#007BFF" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);


export default JourneyItem;
