import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { globalStyles } from '../styles/global';

export default function Header({title}){
    return (
        <View>
            <Text style={globalStyles.headerText}>{title}</Text>
        </View>
    
    )
}