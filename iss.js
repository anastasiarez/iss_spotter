/**
  This file will contain most of the logic for fetching the data from each API endpoint.
  
  API Call #1: Fetch IP Address
  fetchMyIP makes a single API request to retrieve the user's IP address.

  TO THE MENTOR: please note that this code was modified to use get since request was giving an error. Issue was fixed with help of another mentor

 */



//Import the get function from the http module:

const { get } = require('http');

const fetchMyIP = (callback) => {
  const url = `http://api.ipify.org?format=json`;

  //Use the get function to make a GET request to the specified URL:

  get(url, (response) => {

    if (response.statusCode !== 200) {
      const errorMsg = 'Status Code ${response.statusCode} when fetchiing IP. Response: ${body}';
      callback(Error(errorMsg), null);
      return;
    }

    response.setEncoding('utf8');

    //Create a variable rawData to store the response data as a string:

    let rawData = '';

    //response.on('data', callback) is an event listener that listens for the 'data' event on the response object. The 'data' event is triggered whenever a new chunk of data is received in the response. 

    //(chunk) => { rawData += chunk; } is the callback function that is executed when the 'data' event is emitted. It takes the received chunk as a parameter and performs a specific action, which is adding the chunk to the rawData string (rawData = rawData + chunk). chunk represents a portion of the received data.

    response.on('data', (chunk) => { rawData += chunk; });

    //Listen for the end event, which indicates that all data has been received

    //The response.on('end', () => { ... }) event listener is triggered when all the data has been received from the API endpoint.

    //Inside the event listener's callback function, the rawData variable holds the accumulated data received from the API endpoint.

    //The JSON.parse(rawData) line attempts to parse the rawData into a JavaScript object. Assuming the rawData is a valid JSON string, the parsing will be successful and will result in a JavaScript object.

    //After parsing the rawData into the parsedData object, the code assumes that the parsedData object has a property named ip which holds the IP address.

    //By accessing parsedData.ip, the code extracts the IP address from the parsedData object.

    //callback(null, ip) is called to invoke the provided callback function with the extracted IP address as the second argument (null is passed as the first argument to indicate that there is no error). 

    //The catch block catches the error (e) and calls callback(e, null) to invoke the callback function with the error as the first argument and null as the second argument. This provides the caller with the error information.

    response.on('end', () => {
      try {
        // Parse the raw data into a JavaScript object
        const parsedData = JSON.parse(rawData);

        // Extract the IP address from the parsed data
        const ip = parsedData.ip;

        // Call the callback with the IP address
        callback(null, ip);

      } catch (e) {
        // If there's an error during parsing, call the callback with the error
        callback(e, null);
      }
    });
  });
};



//API Call #2: Fetch Geo Coordinates By IP

/*
fetchCoordsByIP takes in an IP address and returns the latitude and longitude for it.
It should take in two arguments: ip (string) and callback
Add the function to the object properties being exported from iss.js */


const fetchCoordsByIP = (ip, callback) => {
  const url = `http://ipwho.is/${ip}`;

  get(url, (response) => {

    if (response.statusCode !== 200) {
      const errorMsg = 'Status Code ${response.statusCode} when fetchiing coords. Response: ${body}';
      callback(Error(errorMsg), null);
      return;
    }

    response.setEncoding('utf8');

    let rawData = '';

    response.on('data', (chunk) => { rawData += chunk; });

    response.on('end', () => {
      try {
        const parsedBody = JSON.parse(rawData);

        if (!parsedBody.success) {
          const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
          callback(Error(message), null);
          return;
        }

        // the latitude and longitude values are extracted from the parsedBody object
        //By using object destructuring, { latitude, longitude } = parsedBody, the code extracts the latitude and longitude properties from the parsedBody object and assigns them to the variables latitude and longitude respectively. This is a shorthand syntax for extracting specific properties from an object.

        const { latitude, longitude } = parsedBody;

        //the code calls the callback(null, { latitude, longitude }) function, passing null as the error argument and an object with the latitude and longitude properties as the data argument.

        callback(null, { latitude, longitude });

      } catch (e) {
        callback(e, null);
      }
    });
  });
};


/**
 Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 Input:
    - An object with keys `latitude` and `longitude`
    - A callback (to pass back an error or the array of resulting data)
 Returns (via Callback):
    - An error, if any (nullable)
    - The fly over times as an array of objects (null if error). Example:
      [ { risetime: 134564234, duration: 600 }, ... ]
 */

//The fetchISSFlyOverTimes function takes in coords (an object containing latitude and longitude) and a callback function as parameters.

//The url variable is constructed using the latitude and longitude values from the coords object. It is a URL that points to an API endpoint for fetching ISS (International Space Station) pass times.

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  get(url, (response) => {

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    // It is assumed that the response body contains a JSON object with a response property that holds the ISS pass times.

    response.setEncoding('utf8');

    let rawData = '';

    response.on('data', (chunk) => { rawData += chunk; });

    response.on('end', () => {
      try {
        const passes = JSON.parse(rawData).response;

        callback(null, passes);

      } catch (e) {
        callback(e, null);
      }
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };