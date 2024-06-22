import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../Constant/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TimeDelivery = (props) => {
    const { sender, item } = props;
    return (
        <View style={[styles.mainView, { justifyContent: 'flex-end' }]}>
            <Text style={[styles.text, { color: sender ? COLORS.white : COLORS.gray }]}>
                {moment(item.timestamp).format('LLL')}
            </Text>
            <Ionicons
                name="checkmark-done"
                style={[styles.icon, { color: item.seen ? COLORS.black : COLORS.white }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    text: {
        fontFamily: 'Poppins-Regular',
        fontSize: 7,
    },
    icon: {
        fontSize: 15,
        marginLeft: 5,
    },
});

export default TimeDelivery;
