const https = require('https')

function getRequest() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    var hr = (today.getHours() + 8)%24;
    var now = yyyy + '-' + mm + '-' + dd + 'T' + hr + ':' + min + ':' + sec;
    
    
  var url = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=' + now;

  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let rawData = '';

      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(err));
    });
  });
}

exports.handler = async (event) => {
    try {
        const result = await getRequest();
        console.log('result is: ' + result);
        
        const response = {
            statusCode:200,
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(result.items[0].forecasts[11]),
        };
        return response;
    } catch (error) {
        console.log('Error is: ' + error);
        return {
            statusCode:400,
            body: error.message,
        }
    }
};