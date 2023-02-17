
// IMPORTS ////////
const request = require('request');

/**
 * Makes a single API request to retrieve the IPv4 address.
 * Input:
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP as a string (null if error). Example:
 *     "172.219.207.222"
*/

const fetchMyIP = function(callback) {

  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    // Edge Cases
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      error = `Status code ${response.statusCode}. Verify output.`;
      callback(Error(error), null);
      return;
    }
    const ip = JSON.parse(body).ip;

    callback(null, ip);
  });
};


/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
*/

const fetchCoordByIP = function(ip, callback) {

  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    // Convert incoming data to JSON
    const bodyJSON = JSON.parse(body);

    // Edge Cases
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      error = `Status code ${response.statusCode}. Verify output.`;
      callback(Error(error), null);
      return;
    }
    if (!bodyJSON.success) {
      error = bodyJSON.message;
      callback(Error(error), null);
      return;
    }

    const coord = {
      'lat': bodyJSON.latitude,
      'lon': bodyJSON.longitude
    };
    callback(null, coord);
  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const nextIss = function(coord, callback) {

  request(`https://iss-flyover.herokuapp.com/json/?lat=${coord.lat}&lon=${coord.lon}`, (error, response, body) => {

    // Edge Cases
    if (body === 'invalid coordinates') {
      error = body;
      callback(Error(error), null);
      return;
    }
    if (response.statusCode !== 200) {
      error = `Status code ${response.statusCode}. Verify output.`;
      callback(Error(error), null);
      return;
    }
    if (error) {
      callback(error, null);
      return;
    }

    // Convert incoming data to JSON
    const bodyJSON = JSON.parse(body);
    const passesMilli = bodyJSON.response;

    const convertedPasses = passesMilli.map((item) => {
      const date = new Date(item.risetime * 1000);
      const localDate = date.toLocaleString();
      return { ...item, risetime: localDate };
    });
    callback(error, convertedPasses);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    fetchCoordByIP(ip,(error, coord) => {
      nextIss(coord,(error, passes) => {
        callback(error, passes);
      });
    });
  });
};


// module.exports = { fetchMyIP, fetchCoordByIP, nextIss };
module.exports = { nextISSTimesForMyLocation};

// --------------------------------------------------------------



// fetchMyIP((error, ip) => {
//   console.log('ip:', ip);
//   console.log('error: ',error);
// });
// --------------------------------------------------------------



// // TEST VALUE
// const ip ="172.219.207.222";
// // const ip ="172";

// fetchCoordByIP(ip,(error, coord) => {
//   if (error){
//     console.log('error: ',error);
//   } else{
//     console.log('coord:', coord.lat + ' ' + coord.lon);
//   };
// });
      
// --------------------------------------------------------------
      


//TEST VALUE ////////
// const coord = {lat:51.0486151, lon:-114.0708459};
// // const coord = {lat:51.0486151, lon:-11400.0708459};


// nextIss(coord,(error,passes) => {
//   console.log(passes);
//   console.log(error);
// });

// --------------------------------------------------------------