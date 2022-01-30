const fs = require('fs');

BATCH_SIZE = 10; // How many time periods to check in average for lane detection
BRAKE_THRESHOLD = 600;

function parseFile(id, type) {
    data = fs.readFileSync("./data/" + type + "_" + id + ".csv").toString();
    data = data.split("\n").slice(1);
    d = []
    for(var i = 0; i < data.length; i++) {
        d.push(parseFloat(data[i],10))
    }

    return d;
}

function areasToSlopes(a) {
    s = []
    for(var i = 1; i < a.length-1; i++) {
        s.push((s[i]-s[i-1]))
    }
    return s
}

function getBrakeSpikes(s) {
    var inBrake = false;
    var brakes = 0;

    for(var i = 0; i < s.length; i++) {
        if(Math.abs(s[i]) > BRAKE_THRESHOLD && !inBrake) {
            inBrake = true;
            brakes++;
        }

        if(Math.abs(s[i]) < BRAKE_THRESHOLD && inBrake) {
            inBrake = false;
        }
    }

    return brakes;
}

function getSpeedViolations(s) {
    var violations = 0
    var i = 0;
    while(i < s.length-BATCH_SIZE) {
        var avg = 0;

        for(var j = i; j <= i+BATCH_SIZE; j++) {
            avg += Math.abs(s[j]);
        }
        avg /= BATCH_SIZE;

        for(var j = i; j <= i+BATCH_SIZE; j++) {
            if(Math.abs(s[j]) > avg) {
                violations++;
            }
        }
        i += BATCH_SIZE;
    }

    var avg = 0;

    for(var j = i; j <= i+BATCH_SIZE; j++) {
        avg += Math.abs(s[j]);
    }
    avg /= BATCH_SIZE;

    for(var j = i; j <= i+BATCH_SIZE; j++) {
        if(Math.abs(s[j]) > avg) {
            violations++;
        }
    }

    return violations*5/s.length;
}

function score(id) {
    var out = {};
    var brakes = getBrakeSpikes(parseFile(id, "detection"));
    var speeds = getSpeedViolations(parseFile(id, "speed"));

    var score = (10-10*Math.min(1,(brakes+1)*speeds))
    out["score"] = score;
    out["suggestions"] = [];
    if(brakes > 0) {
        out["suggestions"].push("brakes")
    }

    if(speeds > 0.45) {
        out["suggestions"].push("speed")
    }

    return out
}

// console.log(getBrakeSpikes(parseDetectionFile('1e19fa82-a064-4fdb-af6c-63f4e8a2069d')))
// console.log(getBrakeSpikes(parseFile('eee368be-dbce-4feb-af5f-709dedc20498', 'detection')))
console.log(score('eee368be-dbce-4feb-af5f-709dedc20498'))
// export default score;