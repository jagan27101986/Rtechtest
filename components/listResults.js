import React , { useState } from 'react';
import {SafeAreaView,View,Alert,FlatList,Text,ScrollView} from 'react-native'; 
import { globalStyles } from '../styles/global';

export default function ListResult({resultSet}){
     return (
         /** DISPLAY RESULT SET FOR LOCATION, POSTCODE AND STATE **/
  <FlatList 
         nestedScrollEnabled={true}
             keyExtractor={item => item.id.toString()}
              data={resultSet}
            contentContainerStyle={{
                flexGrow: 1,
                }}
              renderItem= {({item})=> (
                    <Text style={globalStyles.listItem}>{item.location}{', '}{item.postcode}{', '}{item.state}</Text>    
              )}
             
             />

    )
}
