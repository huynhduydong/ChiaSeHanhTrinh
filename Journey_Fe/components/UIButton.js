import React, {Component} from 'react'
import {
    TouchableOpacity, 
    Text,
} from 'react-native'
import {colors} from '../constants'


function UIButton(props) {
    const {onPress, title, isSelected} = props
    return <TouchableOpacity
        onPress={onPress}
        style={{
            borderColor: 'white',
            borderWidth: 1,
            height: 45,
            borderRadius: 5,
            marginHorizontal: 15,
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isSelected == true ? 'white': null
        }}>
        {isSelected == true}
        <Text style={{
            color: isSelected == true ? colors.primary : 'white'
        }}>{title}</Text>
    </TouchableOpacity>
}
export default UIButton