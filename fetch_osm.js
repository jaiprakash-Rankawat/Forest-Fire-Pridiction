const fs = require('fs');
const https = require('https');

const query = `
[out:json][timeout:25];
(
  relation["name"~"Kumbhalgarh", i](24.5, 73.0, 25.5, 74.0);
  way["name"~"Kumbhalgarh", i](24.5, 73.0, 25.5, 74.0);
  relation["boundary"="protected_area"](24.5, 73.0, 25.5, 74.0);
);
out geom;
`;

const postData = "data=" + encodeURIComponent(query);

const options = {
  hostname: 'overpass-api.de',
  port: 443,
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length,
    'User-Agent': 'NodeJS/1.0 (test script)'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Found', parsed.elements.length, 'elements');
      if (parsed.elements.length > 0) {
        fs.writeFileSync('kumbhalgarh_osm.json', JSON.stringify(parsed, null, 2));
        console.log('Saved to kumbhalgarh_osm.json');
      } else {
        console.log('No elements found.');
      }
    } catch(e) {
      console.log("Error parsing JSON:", e.message);
      fs.writeFileSync('kumbhalgarh_osm_error.txt', data);
    }
  });
});

req.on('error', (e) => { console.error(e); });
req.write(postData);
req.end();
