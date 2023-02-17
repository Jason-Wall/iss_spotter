const request = require('request-promise-native');

const fetchMyIP = () => {
  return request(`https://api.ipify.org?format=json`);
};

const fetchCoordByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

const nextIss = (body) => {
  const bodyJSON = JSON.parse(body);
  const coord = {
    'lat': bodyJSON.latitude,
    'lon': bodyJSON.longitude
  };

  return request(`https://iss-flyover.herokapp.com/json/?lat=${coord.lat}&lon=${coord.lon}`) // BAD URL!
  // return request(`https://iss-flyover.herokuapp.com/json/?lat=${coord.lat}&lon=${coord.lon}`)
};

const output = (body) => {
  const bodyJSON = JSON.parse(body);

  // Convert times in mSec to month day year.
  const passesMilli = bodyJSON.response;
  const convertedPasses = passesMilli.map((item) => {
    const date = new Date(item.risetime * 1000);
    const localDate = date.toLocaleString();
    return { ...item, risetime: localDate };
  });

  for (let element of convertedPasses) {
    console.log(`Next pass at ${element.risetime} for ${element.duration} seconds!`);
  };
  return convertedPasses;
}


const nextISSTimes = () => {
  return fetchMyIP()
  .then(fetchCoordByIP)
  .then(nextIss)
  .then(output)
  
};


module.exports = { nextISSTimes };