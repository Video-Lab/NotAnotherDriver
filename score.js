const fs = require('fs');

BATCH_SIZE = 10; // How many time periods to check in average for lane detection


function parseDetectionFile(id) {
    data = fs.readFileSync("./data/detection_" + id + ".csv").toString();
    data = data.split("\n").slice(1);
    d1 = []
    d2 = []
    for(var i = 0; i < data.length; i++) {
        values = data[i].split(",");
        d1.push(parseFloat(values[0],10))
        d2.push(parseFloat(values[1],10))
    }

    return [d1,d2]
}

function getBrakeSpikes(detectionValues) {
    var i = 0;
    d2 = detectionValues[1];
    var spikes = 0;
    while(i < d2.length-BATCH_SIZE) {
        var avgSpike = 0;

        for(var j = i; j <= i+BATCH_SIZE; j++) {
            avgSpike += Math.abs(d2[j]);
        }
        avgSpike /= BATCH_SIZE;

        for(var j = i; j <= i+BATCH_SIZE; j++) {
            if(Math.abs(d2[j]) > avgSpike) {
                spikes++;
            }
        }
        i += BATCH_SIZE;
    }

    var avgSpike = 0;

    for(var j = i; j <= data.length; j++) {
        avgSpike += d2[j];
    }
    avgSpike /= BATCH_SIZE;

    for(var j = i; j <= data.length; j++) {
        if(d2[j] > avgSpike) {
            spikes++;
        }
    }

    return spikes;
}



function score(id) {
    var out = {};
}

console.log(getBrakeSpikes(parseDetectionFile('1e19fa82-a064-4fdb-af6c-63f4e8a2069d')))
// export default score;