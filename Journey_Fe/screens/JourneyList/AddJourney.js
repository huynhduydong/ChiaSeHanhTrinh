import React, { useState, useRef } from 'react';
import { View, Text, Button, Alert, TextInput, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import API, { authApi, endpoints } from '../../configs/API';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImgToBase64 from 'react-native-image-base64';

const AddJourney = ({ navigation }) => {
  const [journeyData, setJourneyData] = useState({
    name: '',
    description: '',
    main_image: null
  });
  const [editorContent, setEditorContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const richText = useRef();

  const handleChange = (key, value) => {
    setJourneyData({
      ...journeyData,
      [key]: value
    });
  };

  const handleSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setJourneyData({
        ...journeyData,
        description: editorContent
      });

      let token = await AsyncStorage.getItem('access-token');

      const formData = new FormData();
      formData.append('name', journeyData.name);
      formData.append('description', editorContent);
      if (journeyData.main_image) {
        const filename = journeyData.main_image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('main_image', {
          uri: journeyData.main_image,
          name: filename,
          type
        });
      }

      const response = await authApi(token).post(endpoints.add_journey, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        const journey = response.data;
        Alert.alert('Success', 'Journey added successfully');
        setEditorContent('');
        setJourneyData({ name: '', description: '', main_image: null });
        setImagePreview(null);
        console.log('Journey added successfully'); // Log toàn bộ dữ liệu phản hồi
        // Điều hướng đến AddPlaceVisit và truyền journeyId
        navigation.navigate('AddPlaceVisit', { JourneyId: journey.id });
      } else {
        Alert.alert('Error', 'Failed to add Journey. Please try again.');
      }
    } catch (error) {
      console.error('Error creating Journey:', error);
      Alert.alert('Error', 'Failed to add Journey. Please try again.');
    }
  };

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 100,
      height: 100,
      cropping: true,
    }).then((image) => {
      setJourneyData({
        ...journeyData,
        main_image: image.path
      });
      setImagePreview(image.path);
    });
  };

  const pickDescriptionImage = () => {
    ImagePicker.openPicker({
      width: 100,
      height: 120,
      cropping: true,
    }).then((image) => {
      ImgToBase64.getBase64String(image.path)
        .then(base64String => {
          const str = `data:${image.mime};base64,${base64String}`;
          richText.current.insertImage(str);
        })
        .catch(err => console.log(err));
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.label}>Journey Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('name', text)}
              value={journeyData.name}
            />

            <Text style={styles.label}>Journey Description:</Text>

            <RichEditor
              ref={richText}
              onChange={(descriptionText) => setEditorContent(descriptionText)}
              style={styles.editor}
            />

            <Button title="Pick Main Image" onPress={pickImage} />
            {imagePreview && (
              <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
            )}
          </ScrollView>
        </TouchableWithoutFeedback>

        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.keyboard,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.insertImage,
            actions.checkboxList,
            actions.insertVideo,
            actions.heading1,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.undo,
            actions.redo,
            actions.removeFormat
          ]}
          onPressAddImage={() => pickDescriptionImage()}
          style={styles.toolbar}
        />

        <View style={styles.submitButton}>
          <Button title="Add Journey" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,  // Adding padding to ensure Add Journey button is visible
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  editor: {
    minHeight: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  imagePreview: {
    width: 300,
    height: 400,
    marginTop: 10,
    alignSelf: 'center',
  },
  submitButton: {
    padding: 20,
    backgroundColor: '#fff',
  }
});

export default AddJourney;
