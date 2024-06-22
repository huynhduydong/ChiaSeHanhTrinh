import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator, ScrollView, Alert, Button, TouchableOpacity } from 'react-native';
import { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import { MyDispatchContext } from '../../configs/MyContext';

const ProfileCurrentUser = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);

  const dispatch = useContext(MyDispatchContext);
  const navigation = useNavigation();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res = await authApi(token).get(endpoints['current_user_profile']);
        setProfile(res.data);
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setEmail(res.data.email);
        setAvatar(res.data.avatar);
        setLoading(false);
      } catch (ex) {
        console.error(ex);
        setError(ex);
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let form = new FormData();
      form.append('first_name', firstName);
      form.append('last_name', lastName);
      form.append('email', email);

      if (avatar && avatar.uri) {
        form.append('avatar', {
          uri: avatar.uri,
          name: avatar.uri.split('/').pop(),
          type: avatar.type || 'image/jpeg',
        });
      }

      let res = await authApi(token).patch(endpoints['current_user_profile'], form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(res.data);
      setAvatar(res.data.avatar);
      setIsEditing(false);
      Alert.alert('Thành công', 'Thông tin người dùng đã được cập nhật');
    } catch (ex) {
      console.error(ex);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin người dùng');
    }
  };

  const handleAvatarPress = async () => {
    try {
      const res = await ImagePicker.openPicker({
        width: 80,
        height: 80,
        cropping: true,
        borderRadius: 40,
        marginBottom: 10,
      });
      setAvatar({
        uri: res.path,
        type: res.mime,
        name: res.path.split('/').pop(),
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to select image');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access-token');
    await AsyncStorage.removeItem('user');

    dispatch({ type: 'logout' });

    navigation.navigate('LoginMain');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading profile</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image style={styles.avatar} source={{ uri: avatar.uri ? avatar.uri : avatar }} />
        </TouchableOpacity>
        <Text style={styles.status}>Active</Text>
      </View>
      <View>
        <Icon style={{ alignSelf: 'flex-end' }} name="update" size={30} color="#000" onPress={() => setIsEditing(true)} />
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={profile.username} editable={false} />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          editable={isEditing}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          editable={isEditing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
        />

        <Text style={styles.label}>Đánh giá độ tin cậy (Rating)</Text>
        <TextInput style={styles.input} value={String(profile.average_rating)} editable={false} />

        <Text style={styles.label}>Số hành trình đã đăng</Text>
        <TextInput style={styles.input} value={String(profile.journey_count)} editable={false} />
      </View>
      {isEditing && (
        <Button 
          title="Cập nhật" 
          onPress={handleUpdate} 
          color="green"
        />
      )}
      <Button 
        title="Logout" 
        onPress={handleLogout} 
        color="red"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#4c4cff',
    paddingBottom: 20,
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  status: {
    color: '#00ff00',
    fontSize: 16,
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProfileCurrentUser;
