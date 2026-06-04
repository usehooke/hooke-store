import fetch from 'node-fetch';

async function testHercai() {
  const url = `https://hercai.onrender.com/v3/text2image?prompt=a+cat`;
  const res = await fetch(url);
  console.log(res.status, res.statusText);
  if (res.ok) {
    const data = await res.json();
    console.log(data);
  }
}

testHercai();
