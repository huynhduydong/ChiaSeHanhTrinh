import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Dữ liệu giả lập
        const dummyData = [
            {
                id: 1,
                userAvatarUrl: 'https://example.com/user1.jpg',
                description: 'Bạn đã tìm kiếm Facebook "Dương Hữu Thành"',
                timestamp: '2024-05-29T10:00:00Z'
            },
            {
                id: 2,
                userAvatarUrl: 'https://example.com/user2.jpg',
                description: 'Bạn đã tìm kiếm Facebook "key api google map free"',
                timestamp: '2024-05-29T09:00:00Z'
            },
            {
                id: 3,
                userAvatarUrl: 'https://example.com/user3.jpg',
                description: 'Bạn đã tìm kiếm Facebook "Google Maps JavaScript API, GIS Web Developer"',
                timestamp: '2024-05-29T08:00:00Z'
            },
            {
                id: 4,
                userAvatarUrl: 'https://example.com/user4.jpg',
                description: 'Bạn đã tìm kiếm Facebook "api key google map"',
                timestamp: '2024-05-29T07:00:00Z'
            },
            {
                id: 5,
                userAvatarUrl: 'https://example.com/user5.jpg',
                description: 'Bạn đã tìm kiếm Facebook "thẻ visa ảo chạy quảng cáo"',
                timestamp: '2024-05-28T10:00:00Z'
            },
            {
                id: 6,
                userAvatarUrl: 'https://example.com/user6.jpg',
                description: 'Bạn đã tìm kiếm Facebook "thẻ visa ảo"',
                timestamp: '2024-05-28T09:00:00Z'
            },
        ];
        
        setActivities(dummyData);
    }, []);

    const renderItem = ({ item }) => (
        <ListItem bottomDivider>
            <Avatar source={{ uri: item.userAvatarUrl }} />
            <ListItem.Content>
                <ListItem.Title>{item.description}</ListItem.Title>
                <ListItem.Subtitle>{new Date(item.timestamp).toLocaleString()}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={activities}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default ActivityLog;
