import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { globalStyles } from '../styles/global';

export default function Header({title}){
    return (
        <View style={globalStyles.headerTitle}>
            <Text style={globalStyles.headerText}>{title}</Text>
        </View>
    )
}