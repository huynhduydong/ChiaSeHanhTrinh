import React, { useState, useRef } from 'react';
import { View, Text, Button, Alert, TextInput, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import API, { endpoints } from '../../configs/API';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';

const AddJourney = () => {
  const [journeyData, setJourneyData] = useState({
    name: '',
    description: ''
  });

  const [editorContent, setEditorContent] = useState('');

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

      await API.post(endpoints.addjourney, journeyData);

      Alert.alert('Success', 'Journey added successfully');
      setEditorContent('');
      console.log('Journey added successfully');
    } catch (error) {
      console.error('Error creating Journey:', error);
      Alert.alert('Error', 'Failed to add Journey. Please try again.');
    }
  };

  const richText = useRef();

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log("Imagemime", image);
      convertBase64(image);
    });
  };

  const convertBase64 = image => {
    ImgToBase64.getBase64String(image.path)
      .then(base64String => {
        const str = `data:${image.mime};base64,${base64String}`;
        richText.current.insertImage(str);
      })
      .catch(err => console.log(err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Journey Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('name', text)}
        value={journeyData.name}
      />

      <Text style={styles.label}>Journey Description:</Text>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => setEditorContent(descriptionText)}
            style={styles.editor}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <View style={styles.toolbarContainer}>
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
          onPressAddImage={() => pickImage()}
          style={styles.toolbar}
        />
      </View>
      <Button title="Add Journey" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
    flex: 1,
    minHeight: 400,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  toolbarContainer: {
    borderTopColor: 'gray',
    borderTopWidth: 1,
    marginTop: 10,
  },
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});

export default AddJourney;
