import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import API, { authApi, endpoints } from '../../configs/API';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserJourneysScreen = ({ route, navigation }) => {
    // const { userId } = route.params;
    const defaultAvatar = 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/409808276_2136446710040143_4957388703891454700_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGkRobaUFCGL3eLId4b6Mo_FZp0t1X6XFEVmnS3VfpcUWxNFPmslVUO3TRGkc05PGgn_12pb6IiEk8-8npqV_Qg&_nc_ohc=A8Cm3wnYWO0Q7kNvgFDy9D0&_nc_ht=scontent.fsgn2-6.fna&oh=00_AYAe8KyFqXFWnXdfBzY7uHpoDkw_4DxHi88j1CreWXKmGQ&oe=664D81AB';


    const [journeys, setJourneys] = useState([]);
    const goToJourneyDetail = (JourneyId) => {
        navigation.navigate("JourneyDetail", { "JourneyId": JourneyId })
    }
    useEffect(() => {
        const loadJourneys = async () => {
            try {
              let token = await AsyncStorage.getItem('access-token');

              let res = await authApi(token).get(endpoints['journey_by_user']);

                setJourneys(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadJourneys();
    }, [3]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToJourneyDetail(item.id)}>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Image
                        source={{ uri: "http://localhost:8000/static"+item.main_image || defaultAvatar }}
                        style={styles.image}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.date}>Created: {moment(item.created_date).format('YYYY-MM-DD')}</Text>
                        <Text style={styles.date}>Updated: {moment(item.updated_date).format('YYYY-MM-DD')}</Text>
                        <Text style={styles.info}>Comments: {item.comments_count}</Text>
                        <Text style={styles.info}>Join Journey: {item.join_count}</Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('UpdateJourney', { JourneyId: item.id })}
                            style={styles.updateButton}
                        >
                            Cập nhật
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={journeys}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5F5F5',
    },
    card: {
      marginVertical: 8,
      borderRadius: 10,
      backgroundColor: '#EDE7F6',  // Light purple background
    },
    cardContent: {
      flexDirection: 'row',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#6A1B9A',  // Dark purple text
      marginBottom: 4,
    },
    date: {
      fontSize: 14,
      color: '#6A1B9A',  // Dark purple text
      marginBottom: 4,
    },
    info: {
      fontSize: 14,
      color: '#6A1B9A',  // Dark purple text
    },
    updateButton: {
      marginTop: 8,
    },
  });
  

export default UserJourneysScreen;
