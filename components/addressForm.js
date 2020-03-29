import React , { useState } from 'react';
import {View,TextInput,Alert,Keyboard,Picker,FlatList,Text, ScrollView} from 'react-native';
import { globalStyles } from '../styles/global';
import {Formik} from 'formik';
import FlatButton from './button';
import API from './apiAcces';
import Autocomplete from 'react-native-autocomplete-input';
export default function AddressForm(){
  const [address, setAddress] = useState([]);
  const initialValues = {
     postcode: '', 
     suburb: '', 
     state: '' 
  }

   const apiData = (values) => {
      console.log(values);
      const reg = new RegExp('^[0-9]+$'); //POST CODE ONLY NUMBERS TO BE ALLOWED
      if(values.postcode == "" && values.suburb == "" && values.state == "") {
        Alert.alert('','Please enter postcode, suburb or state',[{
          text:'OK', onPress: () => console.log('dismissed')
        }])
      }

      /** STATE IS OPTIONAL, HENCE POSTCODE OR SUBURB WILL BE REQUIRED */
      if(values.suburb == "" && values.postcode == "" && values.state != ""){
        Alert.alert('','Please enter either postcode or suburb',[{
          text:'OK', onPress: () => console.log('dismissed')
        }])
      }

      //CHECK IF THERE IS ONLY POST CODE VALUE ENTERED
      if(values.postcode != "" && values.suburb == ""){
        if(values.postcode.length == 4 &&  reg.test(values.postcode)){
          fetchAPIData(values.postcode,values.suburb,values.state);
        } else {
          Alert.alert('','Not a valid Australian postcode',[{
            text:'OK', onPress: () => console.log('dismissed')
          }])
        }
      }
      //CHECK IF THERE IS ONLY SUBURB  VALUE ENTERED
      if(values.suburb != "" && values.postcode == ""){
        if(values.suburb.length > 4){
          fetchAPIData(values.postcode,values.suburb,values.state);
        } else {
          Alert.alert('','Please enter a suburb more than 3 characters',[{
            text:'OK', onPress: () => console.log('dismissed')
          }])
        }
      }

      if(values.suburb != "" && values.postcode != ""){
        if(values.postcode.length == 4 &&  reg.test(values.postcode) && values.suburb.length > 4){
          fetchAPIData(values.postcode,values.suburb,values.state);
        } else {
        Alert.alert('','Not a valid Australian postcode',[{
          text:'OK', onPress: () => console.log('dismissed')
        }])
        }
      }
   }
   const fetchAPIData = (postcode,suburb,state) => {
     let postCodeSuburb = "";
     if(postcode != "" && suburb == ""){
      postCodeSuburb = postcode;
     } else if(postcode == "" && suburb != ""){
      postCodeSuburb = suburb.trim();
     } else if(postcode != "" && suburb != "" ){
      postCodeSuburb = suburb.trim();
     }
    API.get(`/search.json?q=${postCodeSuburb}&state=${state}`).then(res => {
      const localities = res.data.localities.locality;
      if (localities && localities.length > 0) {
       if(postcode != "" && suburb != ""){
         console.log('inside data')
        const filteredSuburbs =  res.data.localities.locality.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.postcode == postcode);
        setAddress(filteredSuburbs);
        console.log(filteredSuburbs);
       } 
        if(postcode == "" && suburb != ""){
        const filteredSuburbs =  res.data.localities.locality.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()));
        setAddress(filteredSuburbs);
         
        console.log(filteredSuburbs);
       }
        if(postcode != "" && suburb == ""){
        console.log('inside dddd')
        const filteredSuburbs =  res.data.localities.locality.filter(x => x.postcode == postcode);
        setAddress(filteredSuburbs);
        console.log(filteredSuburbs);
       }
      } else if(localities && Object.keys(localities).length > 0) {
        const suburbData = localities.location + ', ' + localities.postcode + ', ' + localities.state;
        console.log(suburbData);
        return suburbData;
      } else {
          Alert.alert('ERROR','Hello Test',[{
          text:'OK', onPress: () => console.log('dasdsad')
      }]);
      }
    })
   }

   
    return (
        <View style={globalStyles.container}> 
               <Formik  initialValues={initialValues}
               onSubmit={(values) => {
                        apiData(values);
               } }
               >
                {(props) => (
                    <View style={globalStyles.addressContainer}>
                        <TextInput
                         style={globalStyles.input}
                         placeholder='Enter PostCode'
                         onChangeText={props.handleChange('postcode')}
                        value={props.values.postcode}
                        keyboardType='numeric'
                        />
                        <TextInput 
                         style={globalStyles.input}
                        placeholder='Enter Suburb'
                        onChangeText={props.handleChange('suburb')}
                        value={props.values.suburb}
                        />
                      <Picker
                    style={{ width: '100%' ,height:40}}
                    selectedValue = {props.values.state}
                    onValueChange={itemValue => props.setFieldValue('state', itemValue)}>
                    <Picker.Item label='Select your State' value={initialValues.state} />
                    <Picker.Item label="Australian Capital Territory" value="ACT" />
                    <Picker.Item label="New South Wales" value="NSW" />
                    <Picker.Item label="Northern Territory" value="NT" />
                    <Picker.Item label="Queensland" value="QLD" />
                    <Picker.Item label="South Australia" value="SA" />
                    <Picker.Item label="Tasmania" value="TAS" />
                    <Picker.Item label="Victoria" value="VIC" />
                    <Picker.Item label="Western Australia" value="wa" />
                </Picker> 
                        {<FlatButton onPress={props.handleSubmit} text='submit' />}
                    </View>
                    
                )}
               </Formik>
           <View>
            
             <FlatList 
             keyExtractor={item => item.id}
              data={address}
              renderItem= {({item})=> (
                    <Text>{item.location}</Text>
              )}
             />
            
             </View>         
        </View>

    )
}