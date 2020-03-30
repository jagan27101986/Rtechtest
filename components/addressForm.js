import React , { useState } from 'react';
import {View,TextInput,Alert,Keyboard,Picker,Text,TouchableWithoutFeedback,ScrollView} from 'react-native';
import { globalStyles } from '../styles/global';
import {Formik} from 'formik';
import FlatButton from './button';
import API from './apiAcces';
import ListResult from './listResults';
export default function AddressForm(){
  const [address, setAddress] = useState([]);
  const initialValues = {
     postcode: '', 
     suburb: '', 
     state: '' 
  }
const stateData = [
    {
    key:'Australian Capital Territory',
    value: 'ACT'
    },
    {
    key:'New South Wales',
    value: 'NSW'
    },
    {
    key:'Northern Territory',
    value: 'NT'
    },
    {
    key:'Queensland',
    value: 'QLD'
    },
    {
    key:'South Australia',  
    value: 'SA'
    },
     {
    key:'Tasmania',
    value: 'TAS'
    },
     {
    key:'Victoria',
    value: 'VIC'
    },
     {
    key:'Western Australia',
    value: 'WA'
    },
]
/** VALIDATION FOR POSTCODE AND SUBURB CHARACTERS **/
   const apiData = (values) => {
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
      //CHECK IF THERE IS ONLY SUBURB VALUE ENTERED
      if(values.suburb != "" && values.postcode == ""){
        if(values.suburb.length > 3){
          fetchAPIData(values.postcode,values.suburb,values.state);
        } else {
          Alert.alert('','Please enter a suburb more than 3 characters',[{
            text:'OK', onPress: () => console.log('dismissed')
          }])
        }
      }

      if(values.suburb != "" && values.postcode != ""){
        if(values.postcode.length != 4 &&  reg.test(values.postcode) == false){
           Alert.alert('','Not a valid Australian postcode',[{
          text:'OK', onPress: () => console.log('dismissed')
        }])
        } else if(values.suburb.length < 3){
           Alert.alert('','Please enter a suburb more than 3 characters',[{
          text:'OK', onPress: () => console.log('dismissed')
        }])
        } else {
               fetchAPIData(values.postcode,values.suburb,values.state);
        }
      }
   }
   /** CLEAR DATA **/
   const clearData = () => {
       setAddress();
      
   }
   /** PRINT ALERT DATA **/
    const printMessage = (message) => {
        Alert.alert('NO MATCH FOUND', message ,[{
          text:'OK', onPress: () => console.log('dismissed')
      }]);
   }   
     /** VALIDATE RESULTSET DATA **/
  const getResultData =  (postcode,suburb,state,suburbData) => {
      let getStateValues;
      /** POSTCODE, STATE AND SUBURB VALUE ENTERED **/
      if(state != ""){
           getStateValues = stateData.find(x => x.value == state).key;
      }
      
      if(postcode != "" && suburb != "" && state != ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.postcode == postcode && x.state == state);
          if(filteredSuburbs.length > 0){
               setAddress(filteredSuburbs);
          } else {
              printMessage(`The postcode ${postcode} does not match the suburb ${suburb} for the state ${getStateValues}`)
          }
       } 
       /** POSTCODE - EMPTY , STATE AND SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state != ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.state == state);
            if(filteredSuburbs.length > 0){
               setAddress(filteredSuburbs);
          } else {
              printMessage(`The suburb ${suburb} does not exist in the state ${getStateValues}`)
          }
       }
       /** SUBURB - EMPTY, POSTCODE AND STATE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state != ""){
        const filteredSuburbs =  suburbData.filter(x => x.postcode == postcode && x.state == state);
        if(filteredSuburbs.length > 0){
               setAddress(filteredSuburbs);
          } else {
              printMessage(`The postcode ${postcode} does not exist in the state ${getStateValues}`)
          }
       }
      /** STATE IS EMPTY **/
      if(postcode != "" && suburb != "" && state == ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.postcode == postcode);
          if(filteredSuburbs.length > 0){
               setAddress(filteredSuburbs);
          } else {
              printMessage(`The postcode ${postcode} does not match the suburb ${suburb}`)
          }
       } 
       /** POSTCODE - EMPTY , STATE AND SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state == ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()));
            if(filteredSuburbs.length > 0){
               setAddress(filteredSuburbs);
          } else {
              printMessage(`No Data found for suburb ${suburb}`)
          }
       }
       /** SUBURB - EMPTY, POSTCODE AND STATE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state == ""){
        const filteredSuburbs =  suburbData.filter(x => x.postcode == postcode);
        if(filteredSuburbs.length > 0){
               setAddress(filteredSuburbs);
          } else {
              printMessage(`No Data found for postcode ${postcode}`)
          }
       }
  }  
   const  fetchAPIData = async (postcode,suburb,state) => {
     let postCodeSuburb = "";
      let getStateValues;
     if(postcode != "" && suburb == ""){
      postCodeSuburb = postcode;
     } else if(postcode == "" && suburb != ""){
      postCodeSuburb = suburb.trim();
     } else if(postcode != "" && suburb != "" ){
      postCodeSuburb = suburb.trim();
     }
     await API.get(`/search.json?q=${postCodeSuburb}&state=${state}`).then(res => {
      const localities = res.data.localities.locality;
      if (localities && localities.length > 0) {
          getResultData(postcode,suburb,state,localities);
      } else if(localities && Object.keys(localities).length > 0) {
          /** IF THE DATA IS SINGLE OBJECT **/
          const suburbData = [];
          suburbData.push(localities);
          getResultData(postcode,suburb,state,suburbData);
      } else {
          if(state != ""){
            getStateValues = stateData.find(x => x.value == state).key;
      
      }
      
           /** ERROR SCENARIOS **/
          if(postcode != "" && suburb != "" && state != ""){
              printMessage(`The postcode ${postcode} does not match the suburb ${suburb} for the state ${getStateValues}`)
       } 
       /** POSTCODE - EMPTY , STATE AND SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state != ""){
              printMessage(`The suburb ${suburb} does not exist in the state ${getStateValues}`)
        }
       /** SUBURB - EMPTY, POSTCODE AND STATE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state != ""){
              printMessage(`The postcode ${postcode} does not exist in the state ${getStateValues}`)
          }
      /** STATE IS EMPTY **/
      if(postcode != "" && suburb != "" && state == ""){
              printMessage(`The postcode ${postcode} does not match the suburb ${suburb}`)
       } 
       /** POSTCODE,STATE - EMPTY, SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state == ""){
              printMessage(`No Data found for suburb ${suburb}`)
          }
       /** SUBURB, STATE - EMPTY, POSTCODE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state == ""){
              printMessage(`No Data found for postcode ${postcode}`)
          }
      }
    })
   }
    return (
        <TouchableWithoutFeedback onPress = {()=> {
        Keyboard.dismiss();
    }}>
        <View style={globalStyles.container}> 
            <Text style={globalStyles.headerT}> Australia Post PostCode/Suburb Search </Text>
               <Formik  initialValues={initialValues}
               onSubmit={(values, { resetForm }) => {
                         clearData();
                   resetForm();
                         Keyboard.dismiss();
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
                         maxLength={4}
                        />
                        <TextInput 
                         style={globalStyles.input}
                        placeholder='Enter Suburb'
                        onChangeText={props.handleChange('suburb')}
                        value={props.values.suburb}
                        />
                        <View style={globalStyles.input}>
                      <Picker
                    style={globalStyles.pickerItems}
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
                    <Picker.Item label="Western Australia" value="WA" />
                </Picker> 
            </View>
                <View style={globalStyles.buttonContainer}>
                        {<FlatButton onPress={props.handleSubmit} text='submit' />}
                         {<FlatButton onPress={clearData} text='clear' />}
                         </View>
                    </View>
                    
                )}
               </Formik>
           <View style={{ flex: 1 }} onStartShouldSetResponder={() => true}> 
                  {address &&
                    <Text style={globalStyles.textResult}>
                      You have {address.length} matches found.
                    </Text>
                }
              <ListResult resultSet={address}/>  
             </View>         
        </View>
</TouchableWithoutFeedback>

    )
}