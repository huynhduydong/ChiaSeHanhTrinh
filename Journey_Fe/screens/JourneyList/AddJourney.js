import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from 'react-native';
import API, { authApi, endpoints } from '../../configs/API';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Provider as PaperProvider, Button, Card, Title } from 'react-native-paper';

const AddJourney = ({ navigation }) => {
  const [journeyData, setJourneyData] = useState({
    name: '',
    description: '',
    main_image: null,
    start_date: '',
    end_date: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartDatePicker, setIsStartDatePicker] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const richText = useRef();
  const fullScreenRichText = useRef();

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

  const showDatePicker = (isStart) => {
    setIsStartDatePicker(isStart);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (isStartDatePicker) {
      setStartDate(moment(date).format('YYYY-MM-DD'));
    } else {
      setEndDate(moment(date).format('YYYY-MM-DD'));
    }
    hideDatePicker();
  };

  const handleSave = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Lỗi', 'Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
      return;
    }
    if (moment().isAfter(startDate)) {
      Alert.alert('Error', 'Ngày bắt đầu phải sau ngày hiện tại.');
      return;
    }
    if (moment(startDate).isAfter(endDate)) {
      Alert.alert('Error', 'Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedJourneyData = {
        ...journeyData,
        name: eventName,
        description,
        start_date: startDate,
        end_date: endDate,
        main_image: imageUri,
      };

      // console.log('Updated Journey Data:', updatedJourneyData);

      let token = await AsyncStorage.getItem('access-token');

      const formData = new FormData();
      formData.append('name', updatedJourneyData.name);
      formData.append('description', updatedJourneyData.description);
      formData.append('start_date', updatedJourneyData.start_date);  // Add start_date to formData
      formData.append('end_date', updatedJourneyData.end_date);  // Add end_date to formData

      if (updatedJourneyData.main_image) {
        const filename = updatedJourneyData.main_image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('main_image', {
          uri: updatedJourneyData.main_image,
          name: filename,
          type,
        });
      }
      const response = await authApi(token).post(endpoints.add_journey, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        const journey = response.data;
        Alert.alert('Thành công', 'Đã thêm hành trình thành công');
        setDescription('');
        setJourneyData({ name: '', description: '', main_image: null, start_date: '', end_date: '' });
        setImageUri(null);
        setStartDate(null);
        setEndDate(null);
        console.log('Journey added successfully');
        navigation.navigate('AddPlaceVisit', { JourneyId: journey.id });
      } else {
        Alert.alert('Lỗi', 'Không thể thêm Hành trình. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating Journey:', error);
      Alert.alert('Lỗi', 'Không thể thêm Hành trình. Vui lòng thử lại.');
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={80}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Card style={styles.card}>
                <Title style={styles.title}>Tạo hành trình mới</Title>
                <TouchableOpacity onPress={selectMainImage} style={styles.imagePicker}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  ) : (
                    <Text style={styles.imagePlaceholder}>Thêm ảnh bìa</Text>
                  )}
                </TouchableOpacity>
                <Card.Content>
                  <TextInput
                    style={styles.input}
                    placeholder="Tên hành trình"
                    value={eventName}
                    onChangeText={setEventName}
                  />
                  <TouchableOpacity onPress={() => showDatePicker(true)} style={styles.datePicker}>
                    <Text style={styles.dateText}>
                      {startDate ? `Ngày bắt đầu: ${startDate}` : 'Chọn ngày bắt đầu'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showDatePicker(false)} style={styles.datePicker}>
                    <Text style={styles.dateText}>
                      {endDate ? `Ngày kết thúc: ${endDate}` : 'Chọn ngày kết thúc'}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                  <View style={styles.richTextContainer}>
                    <ScrollView style={styles.richTextEditor}>
                      <RichEditor
                        ref={richText}
                        placeholder="Mô tả hành trình"
                        initialContentHTML={description}
                        onChange={setDescription}
                      />
                    </ScrollView>
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
                        actions.removeFormat,
                      ]}
                      onPressAddImage={() => {
                        selectDescriptionImage((uri) => {
                          richText.current.insertImage(uri);
                        });
                      }}
                      style={styles.richToolbar}
                    />
                    <TouchableOpacity onPress={() => setIsFullScreen(true)} style={styles.expandButton}>
                      <Text style={styles.expandButtonText}>Mở rộng</Text>
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Thêm hành trình
              </Button>
            </ScrollView>
            <Modal
              visible={isFullScreen}
              animationType="slide"
              onRequestClose={() => setIsFullScreen(false)}
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setIsFullScreen(false)}>
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>
                <RichEditor
                  ref={fullScreenRichText}
                  style={styles.fullScreenEditor}
                  initialContentHTML={description}
                  onChange={setDescription}
                />
                <RichToolbar
                  editor={fullScreenRichText}
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
                    actions.removeFormat,
                  ]}
                  onPressAddImage={() => {
                    selectDescriptionImage((uri) => {
                      fullScreenRichText.current.insertImage(uri);
                    });
                  }}
                  style={styles.richToolbar}
                />
              </SafeAreaView>
            </Modal>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  imagePlaceholder: {
    color: '#aaa',
  },
  datePicker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    justifyContent: 'center',
    paddingLeft: 8,
    borderRadius: 4,
  },
  dateText: {
    color: '#333',
  },
  imagePicker: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    minHeight: 750,  // Adjust this value as needed
  },
  richTextContainer: {
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  richTextEditor: {
    minHeight: 300,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  richToolbar: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 4,
  },
  expandButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 10,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  expandButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  closeButton: {
    color: '#007bff',
    fontSize: 18,
  },
  fullScreenEditor: {
    flex: 1,
    padding: 10,
  },
});

export default AddJourney;
