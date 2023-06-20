const { get } = require('request-promise-native');

const fetchMyIP = function() {
  return get ('https://api.ipify.org?format=json');
};

//The function's purpose is to extract the IP address from the body and use it to make another HTTP GET request to retrieve the coordinates associated with that IP address.
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return get(`http://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return get(url);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation, fetchCoordsByIP, fetchISSFlyOverTimes, fetchMyIP  };
