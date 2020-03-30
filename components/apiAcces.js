import axios from 'axios';

/** ACCESSING API's for Australian POST **/

export default axios.create({
    baseURL: 'https://digitalapi.auspost.com.au/postcode',
    timeout: 1000,
    headers: {
        'auth-key': '872608e3-4530-4c6a-a369-052accb03ca8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'Access-Token, Uid'
    }
});
