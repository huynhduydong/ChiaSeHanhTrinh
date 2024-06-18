import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import API, { authApi, endpoints } from '../../configs/API';

const AddImageJourney = ({ route,navigation }) => {
  const { journeyId } = route.params;
  const [images, setImages] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [content, setContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    };

    loadCurrentUser();
  }, []);

  const selectMainImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const selectDescriptionImage = (callback) => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        callback(`data:${response.assets[0].type};base64,${response.assets[0].base64}`);
      }
    });
  };

  const handleAddImage = async () => {
    if (!imageUri || !content) return;

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    formData.append('content', content);

    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['image_journey'](journeyId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      setImages([...images, res.data]);
      setImageUri(null);
      setContent('');
      Alert.alert('Thành công', 'Thêm hình ảnh cho hành trình thành công');
      console.log('Journey marked as completed.'); 
      navigation.navigate('JourneyDetail', { JourneyId: journeyId });  
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Thêm hình ảnh thất bại.Vui lòng kiểm tra lại');
    }
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={selectMainImage} style={styles.pickImageButton}>
        <Text style={styles.pickImageText}>Chọn hình ảnh</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}
      <TextInput
        label="Nội dung"
        value={content}
        onChangeText={(text) => setContent(text)}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddImage} style={styles.addButton}>
        Thêm hình ảnh của hành trình
      </Button>
    </View>
  );
};

export default AddImageJourney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  pickImageButton: {
    backgroundColor: '#7B61FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  pickImageText: {
    color: '#fff',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#7B61FF',
  },
});
