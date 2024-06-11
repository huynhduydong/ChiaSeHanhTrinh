import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator, ScrollView, Alert, Button } from 'react-native';
import API, { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
const ProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let res = await API.get(endpoints['profile_user'](userId));
        setProfile(res.data);
        setLoading(false);
      } catch (ex) {
        console.error(ex);
        setError(error);
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addReport = async (reportedUserId) => {
    const reason = selectedReason === 'Other' ? otherReason : selectedReason;

    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['reports'], {
        reason,
        reported_user: reportedUserId,
      });
      Alert.alert('Thành công', 'Người dùng đã được báo cáo');
      setModalVisible(false);
    } catch (ex) {
      console.error(ex);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi báo cáo người dùng');
    }
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
        title="Report User" 
        onPress={toggleModal} 
        color="#FF0000"
      />

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn lý do báo cáo</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedReason(value)}
            items={[
              { label: 'Vi phạm chính sách', value: 'Vi phạm chính sách cộng đồng' },
              { label: 'Spam', value: 'Spam' },
              { label: 'Lừa đảo', value: 'Lừa đảo' },
              { label: 'Ngôn từ thù địch', value: 'Ngôn từ thù địch' },
              { label: 'Lý do khác', value: 'Other' },
            ]}
          />
          {selectedReason === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Nhập lý do khác"
              onChangeText={setOtherReason}
              value={otherReason}
            />
          )}
          <Button title="Submit" onPress={() => addReport(profile.id)} />
          <Button title="Cancel" onPress={toggleModal} color="red" />
        </View>
      </Modal>
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

export default ProfileScreen;
