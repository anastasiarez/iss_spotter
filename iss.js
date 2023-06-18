/**
 * It will contain most of the logic for fetching the data from each API endpoint.
 * API Call #1: Fetch IP Address

 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

// use request to fetch IP address from JSON API

const { request } = require('https');

const fetchMyIP = (callback) => {
  const url = 'https://api.ipify.org?format=json';

  request(url, (error, response, body) => {

    if (error) {
      return callback(error, null);
    }
    //the error argument is assumed to be an error object provided by the caller.

    if (response.statusCode !== 200) {
      const errorMsg = 'Status Code ${response.statusCode} when fetchiing IP. Response: ${body}';
      callback(Error(errorMsg), null);
      return;
    }

    // Error(errorMsg) creates a new instance of the JavaScript Error object with the error message errorMsg. This is useful when you want to provide a specific error message along with the error object.

    // JSON.parse is used to convert one data format to other (into a JavaScript object)

    const data = JSON.parse(body);
    const ip = data.ip;
    console.log(ip);
    callback(null, ip);
  });
};

module.exports = { fetchMyIP };


