import fetch from 'node-fetch';

async function testAirforce() {
  const url = `https://api.airforce/v1/imagine2?prompt=a+cat`;
  const res = await fetch(url);
  console.log(res.status, res.statusText);
  if (res.ok) {
    console.log("Success! Got image.");
  }
}

testAirforce();
