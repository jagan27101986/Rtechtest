import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
         borderWidth: 1,
        borderColor: '#eee',
        backgroundColor:'#007bff'
      },
    input:{
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        margin:5
    },
    headerTitle: {
        backgroundColor:'red',
        width:'100%',
        height:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    headerT:{
        textAlign:'center',
        paddingTop:5,
        color:'#fff',
        fontSize:18,
        textTransform:'uppercase'
    },
    
    headerText: {
         flex:1,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
        letterSpacing: 1,
        justifyContent:'center',
    
      },
      addressContainer: {
          padding: 20,
          
      },
     listItem: {
            color:'#000',
            fontWeight:'bold',
             padding: 10,  
            fontSize: 18,
            backgroundColor:'#fff',
            borderWidth:1,
            borderColor:'#000'
     },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around'
    },
    pickerItems:
    { width: '100%',
     height:40, 
     borderColor:'#ddd',
     borderWidth:1,
     fontSize: 18,
     color:'#fff',
      borderWidth:1,
      borderColor:'#000'
    },
    textResult:{
        padding:10,
        color:'#fff',
        fontSize:16,
        fontWeight:'bold'
    }
})