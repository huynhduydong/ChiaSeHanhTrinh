import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { FONTS } from '../Constant/Font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';


const HomeHeader = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
          try {
            let token = await AsyncStorage.getItem('access-token');
            let res = await authApi(token).get(endpoints['current_user_profile']);
            console.log('profile', res.data);
            setProfile(res.data);
            setLoading(false);

          } catch (ex) {
            console.error(ex);
            setError(ex);
            setLoading(false);

          }
        };
        loadProfile();
      }, []);
      if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
      }
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Tin Nhắn</Text>
            <View style={styles.rightContainer}>
                <Ionicons 
                 name="notifications"   
                 style={styles.icon}
                />
                    <Avatar 
                    source={{ uri: profile.avatar }}
                    rounded
                    size="small" />

            </View>
        </View>
    );
}

export default HomeHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 15,
        elevation: 2,
        paddingVertical: 15,
    },
    logo: {
        fontFamily: FONTS.Bold,

        fontSize: 22,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 7,
        fontSize: 24,
    },
});
