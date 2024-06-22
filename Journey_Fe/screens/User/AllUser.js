import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Avatar, SearchBar, Icon } from 'react-native-elements';
import API, { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllUser = ({ navigation }) => {
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res = await authApi(token).get(endpoints['search_user']);
        setListData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handlePress = async (user_b_id) => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['chats'], { user_b_id });
            let chatIdObject = res.data;
      
      let chatId = chatIdObject.chat_id;
      
      Alert.alert('Chat created!', chatId);
      console.log('Chat created!', chatId);
      
      // Truyền giá trị chat_id vào SingleChat
      navigation.navigate('SingleChat', { chat_id: chatId,user_id: user_b_id });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not create chat');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <ListItem bottomDivider containerStyle={{ paddingVertical: 7, marginVertical: 2 }}>
        <Avatar
          source={{ uri: item.avatar }}
          rounded
          title={item.name}
          size="medium"
        />
        <ListItem.Content>
          <ListItem.Title style={{ fontFamily: 'Poppins-Medium', fontSize: 14 }}>
            {item.first_name + ' ' + item.last_name}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}
            numberOfLines={1}
          >
            {item.subtitle}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SearchBar
        placeholder="Search by name..."
        onChangeText={(val) => setSearch(val)}
        value={search}
        containerStyle={styles.searchContainer}
        inputStyle={styles.searchInput}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={listData.filter(item => item.username?.toLowerCase().includes(search.toLowerCase()))}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AllUser;

const styles = StyleSheet.create({
  searchContainer: {
    elevation: 2,
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
  },
});
