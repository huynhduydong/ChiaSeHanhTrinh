import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import API, { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import styles from '../../constants/styles';

const ImageJourneyDetail = ({ navigation, route }) => {
  const [imageJourney, setImageJourney] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const { imageJourneyId } = route.params;

  const loadImageJourney = useCallback(async () => {
    try {
      let res = await API.get(endpoints['image_journey_detail'](imageJourneyId));
      setImageJourney(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }, [imageJourneyId]);

  const loadComments = useCallback(async () => {
    try {
      let res = await API.get(endpoints['comments_image_journey'](imageJourneyId));
      setComments(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }, [imageJourneyId]);

  useFocusEffect(
    useCallback(() => {
      loadImageJourney();
      loadComments();
    }, [imageJourneyId])
  );

  const addComment = async () => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['comments_image_journey'](imageJourneyId), {
        'cmt': content,
      });
      setComments(current => [res.data, ...current]);
      setContent(""); // Clear the input after adding comment
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleAvatarPress = (id) => {
    navigation.navigate("ProfileScreen", { "userId": id });
  };

  if (!imageJourney) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleAvatarPress(imageJourney.user.id)}>
              <Image source={{ uri: imageJourney.user.avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.username}>{imageJourney.user.username}</Text>
              <Text style={styles.time}>{moment(imageJourney.created_date).fromNow()}</Text>
            </View>
            
          </View>
          <Text style={styles.content}>{imageJourney.content}</Text>
          <Card.Cover style={styles.image} source={{ uri: imageJourney.image }} />
      
        </Card.Content>
      </Card>
      <View style={styles.commentSection}>
        <TextInput
          multiline={true}
          label="Nội dung bình luận..."
          value={content}
          onChangeText={setContent}
          mode="outlined"
          style={styles.commentInput}
        />
        <Button mode="contained" onPress={addComment} style={styles.commentButton}>
          Thêm bình luận
        </Button>
      </View>
      <View style={styles.commentsContainer}>
        {comments.length > 0 ? comments.map(c => (
          <Card key={c.id} style={styles.commentCard}>
            <Card.Content style={styles.commentContent}>
              <TouchableOpacity onPress={() => handleAvatarPress(c.user.id)}>
                <Image source={{ uri: c.user.avatar }} style={styles.avatar} />
              </TouchableOpacity>
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentUsername}>{c.user.username}</Text>
                <Text style={styles.commentText}>{c.cmt}</Text>
                <Text style={styles.commentDate}>{moment(c.created_date).fromNow()}</Text>
              </View>
            </Card.Content>
          </Card>
        )) : (
          <Text style={styles.noComments}>Chưa có bình luận nào.</Text>
        )}
      </View>
    </ScrollView>
  );
};


export default ImageJourneyDetail;
