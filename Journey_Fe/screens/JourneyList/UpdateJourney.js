import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import API, { authApi, endpoints } from '../../configs/API';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Provider as PaperProvider, Button, Card, Title } from 'react-native-paper';

const UpdateJourney = ({ route, navigation }) => {
  const { JourneyId } = route.params;
  const [journeyData, setJourneyData] = useState({
    name: '',
    description: '',
    main_image: null,
    start_date: '',
    end_date: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartDatePicker, setIsStartDatePicker] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const richText = useRef();
  const fullScreenRichText = useRef();

  useEffect(() => {
    const loadJourney = async () => {
      try {
        let res = await API.get(endpoints['journeys_detail'](JourneyId));
        const data = res.data;
        setJourneyData(data);
        setImageUri(data.main_image);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setDescription(data.description);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    loadJourney();
  }, [JourneyId]);

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
    if (moment().isAfter(startDate)) {
      Alert.alert('Lỗi', 'Ngày bắt đầu phải sau ngày hiện tại.');
      return;
    }
    if (moment(startDate).isAfter(endDate)) {
      Alert.alert('Lỗi', 'Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedJourneyData = {
        ...journeyData,
        start_date: startDate,
        end_date: endDate,
        main_image: imageUri,
        description,
      };

      let token = await AsyncStorage.getItem('access-token');

      const formData = new FormData();
      formData.append('name', updatedJourneyData.name);
      formData.append('description', updatedJourneyData.description);
      formData.append('start_date', updatedJourneyData.start_date);
      formData.append('end_date', updatedJourneyData.end_date);

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

      const response = await authApi(token).patch(endpoints.journeys_detail(JourneyId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Hành trình được cập nhật thành công');
        navigation.navigate('UpdatePlaceVisit', { JourneyId });
      } else {
        Alert.alert('Error', 'Không thể cập nhật Hành trình. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating Journey:', error);
      Alert.alert('Error', 'Không thể cập nhật Hành trình. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

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
                <Title style={styles.title}>Cập nhật hành trình</Title>
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
                    value={journeyData.name}
                    onChangeText={(text) => setJourneyData({ ...journeyData, name: text })}
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
                  <Modal visible={isFullScreen} onRequestClose={() => setIsFullScreen(false)} animationType="slide">
                    <SafeAreaView style={styles.fullScreenContainer}>
                      <TouchableOpacity onPress={() => setIsFullScreen(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                      </TouchableOpacity>
                      <ScrollView style={styles.fullScreenScrollView}>
                        <RichEditor
                          ref={fullScreenRichText}
                          initialContentHTML={description}
                          onChange={setDescription}
                          style={styles.fullScreenRichEditor}
                        />
                      </ScrollView>
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
                        style={styles.fullScreenRichToolbar}
                      />
                    </SafeAreaView>
                  </Modal>
                  <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                    Cập nhật
                  </Button>
                </Card.Content>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  richTextContainer: {
    marginBottom: 16,
  },
  richTextEditor: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 200,
  },
  richToolbar: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    marginTop: 16,
  },
  imagePicker: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: '#999',
  },
  datePicker: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  dateText: {
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
  fullScreenScrollView: {
    flex: 1,
  },
  fullScreenRichEditor: {
    flex: 1,
    padding: 10,
    minHeight: '100%',
  },
  fullScreenRichToolbar: {
    backgroundColor: '#f5f5f5',
  },
  expandButton: {
    marginTop: 10,
  },
  expandButtonText: {
    color: 'blue',
    textAlign: 'center',
  },
});

export default UpdateJourney;
