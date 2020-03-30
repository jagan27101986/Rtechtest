import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';
import API from '../components/apiAcces';

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
const search = {

   fetchData: async (postcode, suburb, state) => {
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
              console.log(`The postcode ${postcode} does not match the suburb ${suburb} for the state ${getStateValues}`)
       } 
       /** POSTCODE - EMPTY , STATE AND SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state != ""){
              console.log(`The suburb ${suburb} does not exist in the state ${getStateValues}`)
        }
       /** SUBURB - EMPTY, POSTCODE AND STATE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state != ""){
              console.log(`The postcode ${postcode} does not exist in the state ${getStateValues}`)
          }
      /** STATE IS EMPTY **/
      if(postcode != "" && suburb != "" && state == ""){
              console.log(`The postcode ${postcode} does not match the suburb ${suburb}`)
       } 
       /** POSTCODE,STATE - EMPTY, SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state == ""){
              console.log(`No Data found for ${suburb}`)
          }
       /** SUBURB, STATE - EMPTY, POSTCODE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state == ""){
              console.log(`No Data found for ${postcode}`)
          }
      }
    })
    
           
  }
}

const getResultData =  (postcode,suburb,state,suburbData) => {
      let getStateValues;
      /** POSTCODE, STATE AND SUBURB VALUE ENTERED **/
      if(state != ""){
           getStateValues = stateData.find(x => x.value == state).key;
      }
      
      if(postcode != "" && suburb != "" && state != ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.postcode == postcode && x.state == state);
          if(filteredSuburbs.length > 0){
              console.log('The postcode, suburb and state entered are valid');
          } else {
              console.log(`The postcode ${postcode} does not match the suburb ${suburb} for the state ${getStateValues}`)
          }
       } 
       /** POSTCODE - EMPTY , STATE AND SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state != ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.state == state);
            if(filteredSuburbs.length > 0){
                  console.log('The suburb and state entered are valid');
          } else {
              console.log(`The suburb ${suburb} does not exist in the state ${getStateValues}`)
          }
       }
       /** SUBURB - EMPTY, POSTCODE AND STATE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state != ""){
        const filteredSuburbs =  suburbData.filter(x => x.postcode == postcode && x.state == state);
        if(filteredSuburbs.length > 0){
                console.log('The postcode and state entered are valid');
          } else {
              console.log(`The postcode ${postcode} does not exist in the state ${getStateValues}`)
          }
       }
      /** STATE IS EMPTY **/
      if(postcode != "" && suburb != "" && state == ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()) && x.postcode == postcode);
          if(filteredSuburbs.length > 0){
             console.log('The postcode and suburb entered are valid');
          } else {
              console.log(`The postcode ${postcode} does not match the suburb ${suburb}`)
          }
       } 
       /** POSTCODE - EMPTY , STATE AND SUBURB VALUE ENTERED **/
        if(postcode == "" && suburb != "" && state == ""){
        const filteredSuburbs =  suburbData.filter(x => x.location.toLowerCase().includes(suburb.toLowerCase()));
            if(filteredSuburbs.length > 0){
              console.log('The suburb entered is valid');
          } else {
              console.log(`No Data found for suburb ${suburb}`)
          }
       }
       /** SUBURB - EMPTY, POSTCODE AND STATE VALUE ENTERED **/
        if(postcode != "" && suburb == "" && state == ""){
        const filteredSuburbs =  suburbData.filter(x => x.postcode == postcode);
        if(filteredSuburbs.length > 0){
               console.log('The postcode entered is valid');
          } else {
              console.log(`No Data found for postcode ${postcode}`)
          }
       }
  } 


describe('<App />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});

test("Test Cases for postcode and Suburb", () => {
return search.fetchData('2000','Broadway','').then(response => {
    expect(response).toEqual();
  });
});

test("Test Cases for subrub and State ", () => {
return search.fetchData('','Ferntree Gully','TAS').then(response => {
    expect(response).toEqual();
  });
});

test("Valid Test Cases for PostCode, Suburb and State", () => {
return search.fetchData('3000','Melbourne','VIC').then(response => {
    expect(response).toEqual();
  });
});