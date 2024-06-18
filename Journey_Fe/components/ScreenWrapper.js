import React from 'react';
import { View, StyleSheet } from 'react-native';
import BackButton from './BackButton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: 50, // Chừa chỗ cho BackButton
    },
});

const ScreenWrapper = ({ children }) => {
    return (
        <View style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

export default ScreenWrapper;
