import React, { useEffect, useState } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import { FONTS } from '../../constants/Font';
import { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatItem = ({ item, currentUserId, navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const otherUserId = item.participants.find(id => id !== currentUserId);
      if (otherUserId) {
        try {
          let token = await AsyncStorage.getItem('access-token');
          let res = await authApi(token).get(endpoints['profile_user'](otherUserId));
          setUserInfo(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserInfo();
  }, [item, currentUserId]);

  if (!userInfo) return null;

  return (
    <ListItem
      containerStyle={{ paddingVertical: 8, marginVertical: 0 }}
      onPress={() => navigation.navigate('SingleChat', { chat_id: item.chat_id, user_id: userInfo.id })}
    >
      <Avatar source={{ uri: userInfo.avatar }} rounded title={userInfo.username} size="medium" />
      <ListItem.Content>
        <ListItem.Title style={{ fontFamily: FONTS.Medium, fontSize: 14 }}>
          {userInfo.first_name + ' ' + userInfo.last_name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ fontFamily: FONTS.Regular, fontSize: 12 }}
          numberOfLines={1}
        >
          {/* Bạn có thể thêm thông tin phụ ở đây nếu muốn */}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatItem;
