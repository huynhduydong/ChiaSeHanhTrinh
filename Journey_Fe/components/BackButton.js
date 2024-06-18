import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import arrowBackImg from '../assets/arrow_back.png';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10 + getStatusBarHeight(),
        left: 4,
        padding: 6,
        zIndex: 10, // Đảm bảo nút quay lại luôn ở trên cùng
    },
    image: {
        width: 26,
        height: 26,
    },
});

function BackButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.container}>
            <Image style={styles.image} source={arrowBackImg} />
        </TouchableOpacity>
    );
}

export default BackButton;
    