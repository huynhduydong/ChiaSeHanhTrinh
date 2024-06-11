import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator, ScrollView, Alert, Button } from 'react-native';
import  { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileCurrentUser = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let token = await AsyncStorage.getItem('access-token');
        let res =  await authApi(token).get(endpoints['current_user_profile']);
        setProfile(res.data);
        setLoading(false);
      } catch (ex) {
        console.error(ex);
        setError(error);
        setLoading(false);
      }
    };
    loadProfile();
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading profile</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.avatar} source={{ uri: profile.avatar }} />
        <Text style={styles.status}>Active</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={profile.username} editable={false} />

        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value={profile.first_name} editable={false} />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value={profile.last_name} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={profile.email} editable={false} />

        <Text style={styles.label}>Average Rating</Text>
        <TextInput style={styles.input} value={String(profile.average_rating)} editable={false} />

        <Text style={styles.label}>Journey Count</Text>
        <TextInput style={styles.input} value={String(profile.journey_count)} editable={false} />
      </View>
      <Button 
        title="Cập nhật" 
        color="green"
      />
      <Button 
        title="Đăng xuất" 
        color="#FF0000"
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
