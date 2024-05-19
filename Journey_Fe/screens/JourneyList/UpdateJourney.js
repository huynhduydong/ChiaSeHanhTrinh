import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Dimensions } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import API, { endpoints } from '../../configs/API';
import RichEditor from 'react-native-pell-rich-editor';
import HTML from 'react-native-render-html';

const defaultAvatar = 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/409808276_2136446710040143_4957388703891454700_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGkRobaUFCGL3eLId4b6Mo_FZp0t1X6XFEVmnS3VfpcUWxNFPmslVUO3TRGkc05PGgn_12pb6IiEk8-8npqV_Qg&_nc_ohc=A8Cm3wnYWO0Q7kNvgFdK7Bx&_nc_ht=scontent.fsgn2-6.fna&oh=00_AYCHjKcBQtDZFiQ-uK1k0af2gIle8_nT1J1ETxkMrKffzQ&oe=664AA66B';

const UpdateJourney = ({ route, navigation }) => {
  const { JourneyId } = route.params;
  const [journey, setJourney] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const loadJourney = async () => {
      try {
        let res = await API.get(endpoints['journeys_detail'](JourneyId));
        console.log('1111111' + res.data.main_image);
        setJourney(res.data);
        setName(res.data.name);
        setDescription(res.data.description);
        setMainImage(res.data.main_image || defaultAvatar);
      } catch (error) {
        console.error(error);
      }
    };

    loadJourney();
  }, [JourneyId]);
  
  const handleUpdate = async () => {
    if (!mainImage || !isValidUrl(mainImage)) {
      console.error('Invalid image URL');
      return;
    }
      console.log({
    name,
    description,
    main_image: mainImage,
  });
  
    try {
      await API.patch(endpoints['journeys_detail'](JourneyId), {
        name,
        description,
        main_image: mainImage,
      });
      navigation.navigate('JourneyDetail', { JourneyId });
    } catch (error) {
      console.error(error);
    }
  };
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  

  if (!journey) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Image source={{ uri: mainImage }} style={styles.image} />
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            style={styles.input}
          />
          <Button mode="contained" onPress={handleUpdate} style={styles.updateButton}>
            Cập nhật
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EDE7F6',  // Light purple background
  },
  image: {
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
  input: {
    marginBottom: 16,
  },
  richText: {
    height: 200,
    marginBottom: 16,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
  },
  updateButton: {
    marginTop: 8,
  },
});

export default UpdateJourney;
