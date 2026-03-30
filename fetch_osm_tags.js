const fs = require('fs');
const https = require('https');

const query = `
[out:json][timeout:25];
area["name"="Rajasthan"]->.searchArea;
(
  relation["boundary"="protected_area"](area.searchArea);
  relation["boundary"="national_park"](area.searchArea);
  relation["leisure"="nature_reserve"](area.searchArea);
);
out tags;
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
      console.log('Found', parsed.elements.length, 'protected areas in Rajasthan:');
      parsed.elements.forEach(e => {
        if (e.tags.name && e.tags.name.toLowerCase().includes('kumb')) {
          console.log(e.id, e.tags.name);
        }
      });
      // also just log all names to see what's there
      fs.writeFileSync('osm_tags.json', JSON.stringify(parsed, null, 2));
    } catch(e) {
      console.log("Error parsing JSON:", e.message);
    }
  });
});

req.on('error', (e) => { console.error(e); });
req.write(postData);
req.end();
