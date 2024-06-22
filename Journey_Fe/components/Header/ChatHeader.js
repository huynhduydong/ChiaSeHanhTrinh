import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Avatar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../Constant/Color';
import { FONTS } from '../Constant/Font';
import Navigation from '../../Service/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/API';

const ChatHeader = ({ user_id }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                let token = await AsyncStorage.getItem('access-token');
                let res = await authApi(token).get(endpoints['profile_user'](user_id));
                setUserInfo(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserInfo();
    }, [user_id]);

    if (!userInfo) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.theme} translucent={false} />
            <Ionicons
                style={styles.backIcon}
                name="chevron-back"
                onPress={() => Navigation.back()}
            />
            <Avatar
                source={{ uri: userInfo.avatar }}
                rounded
                size="small"
            />
            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.userName}>
                {userInfo.first_name + ' ' + userInfo.last_name}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: COLORS.theme,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        marginHorizontal: 10,
        color: COLORS.white,
        fontSize: 24,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    userName: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: FONTS.SemiBold,
        textTransform: 'capitalize',
    },
});

export default ChatHeader;
