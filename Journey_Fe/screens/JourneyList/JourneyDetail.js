import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Button, Card, Chip, TextInput } from 'react-native-paper';
import API, { authApi, endpoints } from '../../configs/API';
import HTML from 'react-native-render-html';
import moment from 'moment';
import { isCloseToBottom } from '../../utils/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultAvatar = 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/409808276_2136446710040143_4957388703891454700_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGkRobaUFCGL3eLId4b6Mo_FZp0t1X6XFEVmnS3VfpcUWxNFPmslVUO3TRGkc05PGgn_12pb6IiEk8-8npqV_Qg&_nc_ohc=A8Cm3wnYWO0Q7kNvgFdK7Bx&_nc_ht=scontent.fsgn2-6.fna&oh=00_AYCHjKcBQtDZFiQ-uK1k0af2gIle8_nT1J1ETxkMrKffzQ&oe=664AA66B';

const JourneyDetail = ({ route }) => {
  const [journey, setJourney] = useState(null);
  const { JourneyId } = route.params;
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [placeVisits, setPlaceVisit] = useState([]);
  const [images,setImage] = useState([]);


  const [joinJourneys, setJoinJourneys] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        let res = await API.get(endpoints['comments'](JourneyId));
        setComments(res.data);
      } catch (ex) {
        console.error(ex);
      }
    };
    loadComments();
  }, [JourneyId]);
  useEffect(() => {
    const loadImage = async () => {
      try {
        let res = await API.get(endpoints['image_journey'](JourneyId));
        setImage(res.data);
      } catch (ex) {
        console.error(ex);
      }
    };
    loadImage();
  }, [JourneyId]);
  useEffect(() => {
    const loadPlaceVisits = async () => {
      try {
        let res = await API.get(endpoints['place_visits'](JourneyId));
        setPlaceVisit(res.data);
      } catch (ex) {
        console.error(ex);
      }
    };
    loadPlaceVisits();
  }, [JourneyId]);

  useEffect(() => {
    const loadJoinJourneys = async () => {
      try {
        
        let res = await API.get(endpoints['join_detail'](JourneyId));
        setJoinJourneys(res.data);
      } catch (ex) {
        console.error(ex);
      }
    };
    loadJoinJourneys();
  }, [JourneyId]);

  useEffect(() => {
    const loadJourney = async () => {
      try {
        let res = await API.get(endpoints['journeys_detail'](JourneyId));
        setJourney(res.data);
      } catch (ex) {
        console.error(ex);
      }
    };
    loadJourney();
  }, [JourneyId]);

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

      let res = await authApi(token).post(endpoints['add_join'](JourneyId),{ user_id: userId });
      setJoinJourneys(current => [...current, { user: { id: userId } }]);
    } catch (ex) {
      console.error(ex);
    }
  };

  const isCommentAccepted = (userId) => {
    return joinJourneys.some(join => join.user.id === userId);
  };

  if (!journey) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView onScroll={loadMoreInfo} style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover
          style={styles.image}
          source={{ uri: journey.main_image || defaultAvatar }}
        />
        <Card.Content>
          <Text style={styles.title}>{journey.name}</Text>
          {journey.user_journey && (
            <View style={styles.userContainer}>
              <Chip icon="account" style={styles.chip}>{journey.user_journey.username}</Chip>
              <Text style={styles.subtitle}>Full Name: {journey.user_journey.first_name} {journey.user_journey.last_name}</Text>
            </View>
          )}
          <HTML contentWidth={Dimensions.get('window').width} source={{ html: journey.description }} />
          <View style={styles.placeVisitsContainer}>
            {placeVisits.length > 0 ? (
              placeVisits.map(placeVisit => (
                <Card key={placeVisit.id} style={styles.placeVisitCard}>
                  <Card.Content>
                    <Text style={styles.placeVisitName}>{placeVisit.name}</Text>
                    <Text style={styles.placeVisitDescription}>{placeVisit.description}</Text>
                    <Text style={styles.placeVisitLocation}>Location: {placeVisit.latitude}, {placeVisit.longitude}</Text>
                    <Text style={styles.placeVisitAddress}>Address: {placeVisit.address}</Text>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={styles.noPlaceVisits}>No place visits available.</Text>
            )}
          </View>
          <View>
          {images.length > 0 ? (
              images.map(image => (
                <Card key={image.id} style={styles.placeVisitCard}>
                  <Card.Content>
                    <Text style={styles.placeVisitName}>{image.content}</Text>
                    <Image
                source={{ uri: image.image }}
                style={styles.avatar}
              />
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={styles.noPlaceVisits}>No Image available.</Text>
            )}
          </View>
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
              <Image
                source={{ uri: c.user.avatar || defaultAvatar }}
                style={styles.avatar}
              />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  userContainer: {
    marginBottom: 20,
  },
  chip: {
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  commentSection: {
    marginVertical: 10,
  },
  commentInput: {
    marginBottom: 10,
  },
  commentButton: {
    marginBottom: 10,
  },
  commentsContainer: {
    marginVertical: 10,
  },
  commentCard: {
    marginBottom: 10,
    borderRadius: 10,
  },
  commentContent: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
  },
  commentDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  noComments: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
  },
  acceptButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  acceptedChip: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
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
});

export default JourneyDetail;
