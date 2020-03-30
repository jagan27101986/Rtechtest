import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Address from '../components/addressForm';
import Header from '../components/header';
import { createAppContainer } from 'react-navigation';

const screens = {
  Home: {
    screen: Address,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='LawPath' />
      }
    },
  }
};

// home stack navigator screens
const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#007bff', height: 60 }
  }
});

export default createAppContainer(HomeStack);