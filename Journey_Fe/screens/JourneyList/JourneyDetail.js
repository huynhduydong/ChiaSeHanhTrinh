import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { Button, Card, TextInput, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import API, { authApi, endpoints } from '../../configs/API';
import JourneyDetailItem from '../../components/JourneyDetailItem';
import { isCloseToBottom } from '../../utils/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import styles from '../../constants/styles';

const JourneyDetail = ({ route, navigation }) => {
  const [journey, setJourney] = useState(null);
  const { JourneyId } = route.params;
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [placeVisits, setPlaceVisit] = useState([]);
  const [images, setImage] = useState([]);
  const [joinJourneys, setJoinJourneys] = useState([]);
  const [commentsClosed, setCommentsClosed] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      let res = await API.get(endpoints['comments'](JourneyId));
      setComments(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }, [JourneyId]);

  const loadImage = useCallback(async () => {
    try {
      let res = await API.get(endpoints['image_journey'](JourneyId));
      setImage(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }, [JourneyId]);

  const loadPlaceVisits = useCallback(async () => {
    try {
      let res = await API.get(endpoints['place_visits'](JourneyId));
      setPlaceVisit(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }, [JourneyId]);

  const loadJoinJourneys = useCallback(async () => {
    try {
      let res = await API.get(endpoints['join_detail'](JourneyId));
      setJoinJourneys(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }, [JourneyId]);

  const loadJourney = useCallback(async () => {
    try {
      let res = await API.get(endpoints['journeys_detail'](JourneyId));
      setJourney(res.data);
      setCommentsClosed(res.data.comments_closed);
    } catch (ex) {
      console.error(ex);
    }
  }, [JourneyId]);

  useFocusEffect(
    useCallback(() => {
      loadComments();
      loadImage();
      loadPlaceVisits();
      loadJoinJourneys();
      loadJourney();
    }, [JourneyId])
  );

  const loadMoreInfo = ({ nativeEvent }) => {
    if (!comments && isCloseToBottom(nativeEvent)) {
      loadComments();
    }
  };

  const addComment = async () => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['comments'](JourneyId), {
        'cmt': content,
      });
      setComments(current => [res.data, ...current]);
    } catch (ex) {
      console.error(ex);
    }
  };

  const acceptJoinRequest = async (userId) => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['add_join'](JourneyId), { user_id: userId });
      setJoinJourneys(current => [...current, { user: { id: userId } }]);
    } catch (ex) {
      console.error(ex);
    }
  };

  const isCommentAccepted = (userId) => {
    return joinJourneys.some(join => join.user.id === userId);
  };

  const handleEditJourney = (item) => {
    navigation.navigate('UpdateJourney', { JourneyId: item });
  };

  const handleCompleteJourney = async (item) => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['complete'](item));
      Alert.alert('Success', 'Journey marked as completed.');
      console.log('Journey marked as completed.');
    } catch (ex) {
      console.error(ex);
      Alert.alert('Error', 'Failed to marked as completed Journey. Please try again.');
    }
  };

  const handleAvatarPress = (id) => {
    navigation.navigate("ProfileScreen", { "userId": id });
  };

  const handleCloseComments = async (item) => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      await authApi(token).post(endpoints['close_comments'](item));
      setCommentsClosed(true);
      Alert.alert('Success', 'Journey closed comments.');
      console.log('Journey closed comments.');
    } catch (ex) {
      console.error(ex);
      Alert.alert('Error', 'Failed to closed comments Journey. Please try again.');
    }
  };

  if (!journey) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView onScroll={loadMoreInfo} style={styles.container}>
      <JourneyDetailItem
        item={{ ...journey, place_visits: placeVisits, images, joinedUsers: joinJourneys.map(j => j.user.id) }}
        onEdit={handleEditJourney}
        onComplete={handleCompleteJourney}
        onCloseComments={handleCloseComments}
        commentsClosed={commentsClosed}
        handleAvatarPress={handleAvatarPress}
        navigation={navigation}
      />
      {!commentsClosed && (
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
      )}
      {commentsClosed && (
        <Text style={styles.commentsClosedMessage}>Bình luận đã bị đóng bởi chủ hành trình.</Text>
      )}
      <View style={styles.commentsContainer}>
        {comments.length > 0 ? comments.map(c => (
          <Card key={c.id} style={styles.commentCard}>
            <Card.Content style={styles.commentContent}>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { userId: c.user.id })}>
                <Image source={{ uri: c.user.avatar }} style={styles.avatar} />
              </TouchableOpacity>
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentUsername}>{c.user.username}</Text>
                <Text style={styles.commentText}>{c.cmt}</Text>
                <Text style={styles.commentDate}>{moment(c.created_date).fromNow()}</Text>
                {!isCommentAccepted(c.user.id) && (
                  <Button mode="contained" onPress={() => acceptJoinRequest(c.user.id)} style={styles.acceptButton}>
                    Chấp nhận tham gia
                  </Button>
                )}
                {isCommentAccepted(c.user.id) && <Chip style={styles.acceptedChip}>Đã được chấp nhận</Chip>}
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

export default JourneyDetail;
