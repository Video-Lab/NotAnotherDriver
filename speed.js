const axios = require('axios')
const fs = require('fs')

var positions = []
const ENDPOINT = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + process.env.GEOLOCATION_API_KEY;
const INTERVAL = 1000;

function getLocation() {
    axios
    .post(ENDPOINT)
    .then(res => {
    //   console.log(`statusCode: ${res.status}`)
    console.log(res.data)
      return res.data
    })
    .catch(error => {
      console.error(error)
      return null;
    })
}

function getDistance(loc1, loc2) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const dphi = (loc2.lat-loc1.lat) * Math.PI/180;
    const dgamma = (loc2.lng-loc1.lng) * Math.PI/180;
    
    const a = Math.sin(dgamma/2) * Math.sin(dphi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(dgamma/2) * Math.sin(dgama/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = R * c;
    return d;
}

function toMPH(mpms) {
    return mpms/0.00044704;
}

function getSpeed(d) {
    return d/INTERVAL;
}

function locationTracking() {
    positions = []
    c = setInterval(function() {
        loc = getLocation()
        if(loc) positions.push(loc);
    }, INTERVAL);

}

function stopLocationTracking(c) {
    clearInterval(c);
}

function positionsToSpeeds(pos) {
    s = []
    for(var i = 1; i < pos.length-1; i++) {
        s.append(toMPH((pos[i]-pos[i-1])/INTERVAL))
    }

    return s
}
function writeSpeeds(s, id="0") {
    var content = "speed\n"
    for(var i = 0; i < s.length; i++) {
        content += s[i].toString() + "\n"
    }
    fs.writeFile('./data/speed_' + id + ".csv", content, err => {
        if (err) {
          console.error(err)
          return
        }
      })     
}