// IMPORTS ////////////
// const {fetchMyIP, fetchCoordByIP, nextIss, nextISSTimesForMyLocation} = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  for (let element of passTimes) {
    console.log(`Next pass at ${element.risetime} for ${element.duration} seconds!`);
  }
});