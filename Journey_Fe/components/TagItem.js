import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const TagItem = ({ label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.tagItem}>
        <Text style={styles.tagText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    tagItem: {
        flex: 1,
        margin: 4,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        color: '#333',
    },
});

export default TagItem;
