const {nextISSTimes} = require('./iss_promised');

nextISSTimes()
.catch((err) => console.log("Failure:",err.message));

