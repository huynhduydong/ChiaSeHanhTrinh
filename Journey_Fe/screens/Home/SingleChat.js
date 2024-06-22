import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatHeader from '../../components/Header/ChatHeader';
import MsgComponent from '../../components/Chat/MsgComponent';
import { COLORS } from '../../constants/Color';
import firebase from '../../configs/firebaseConfig'; // Đường dẫn tới tệp firebaseConfig.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/API';

const SingleChat = (props) => {
  const { chat_id, user_id } = props.route.params;
  const [msg, setMsg] = useState('');
  const [allChat, setAllChat] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUsername = async () => {
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res = await authApi(token).get(endpoints['current-user']);
        setUsername(res.data.username);
      } catch (error) {
        console.error(error);
      }
    };

    getUsername();

    const messagesRef = firebase.database().ref(`chats/${chat_id}/messages`);

    const handleNewMessages = (snapshot) => {
      if (snapshot.exists()) {
        let messages = [];
        snapshot.forEach((childSnapshot) => {
          messages.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        setAllChat(messages.reverse());
      }
    };

    messagesRef.on('value', handleNewMessages);

    return () => messagesRef.off('value', handleNewMessages); // Dừng lắng nghe khi component unmount
  }, [chat_id]);

  const handleSend = async () => {
    if (msg.trim()) {
      try {
        const newMessageRef = firebase.database().ref(`chats/${chat_id}/messages`).push();
        await newMessageRef.set({
          message: msg,
          user: username,
          timestamp: new Date().toISOString(),
          type: 'sender', 
        });
        setMsg('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader user_id={user_id} />
      <ImageBackground
        source={require('../../assets/Background.jpg')}
        style={{ flex: 1 }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={allChat}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          inverted
          renderItem={({ item }) => (
            <MsgComponent
              sender={item.type === "sender"}
              message={item.message}
              item={item}
            />
          )}
        />
      </ImageBackground>
      <View
        style={{
          backgroundColor: COLORS.theme,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 7,
          justifyContent: 'space-evenly'
        }}
      >
        <TextInput
          style={{
            backgroundColor: COLORS.white,
            width: '80%',
            borderRadius: 25,
            borderWidth: 0.5,
            borderColor: COLORS.white,
            paddingHorizontal: 15,
            color: COLORS.black,
          }}
          placeholder="Type a message"
          placeholderTextColor={COLORS.black}
          multiline
          value={msg}
          onChangeText={(val) => setMsg(val)}
        />
        <TouchableOpacity onPress={handleSend}>
          <Icon
            style={{
              color: COLORS.white,
              fontSize: 24
            }}
            name="paper-plane-sharp"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SingleChat;
