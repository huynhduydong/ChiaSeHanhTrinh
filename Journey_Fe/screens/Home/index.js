import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../../components/Header/HomeHeader';
import { authApi, endpoints } from '../../configs/API';
import ChatItem from './ChatItem';

const Home = ({ navigation }) => {
  const [listData, setListData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res = await authApi(token).get(endpoints['current_user_profile']);
        setCurrentUserId(parseInt(res.data.id));
        console.log('current user', res.data.id);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchChats = async () => {
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res = await authApi(token).get(endpoints['chats']);
        setListData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
    fetchChats();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <HomeHeader />
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={listData}
        renderItem={({ item }) => (
          <ChatItem item={item} currentUserId={currentUserId} navigation={navigation} />
        )}
      />
      <TouchableOpacity
        style={styles.but}
        onPress={() => navigation.navigate('AllUser')}
      >
        <FontAwesome5
          name="users"
          style={{ color: '#ffffff', fontSize: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  but: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200ee', // Thay thế mã màu tương ứng của COLORS.theme
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
