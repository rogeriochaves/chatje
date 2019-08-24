const crypto = require("crypto");
const { Client } = require("./libfb-monkeypatched/dist");
const fs = require("fs");

let verifier = null;
let client = new Client();
try {
  const cached = JSON.parse(fs.readFileSync(".credentials_cache").toString());
  client.loggedIn = true;
  client.httpApi.token = cached.httpApi;
  client.session.tokens = cached.session;
  client.mqttApi.connect(client.session.tokens, client.session.deviceId);
  console.log("Credentials retrieved from cache");
} catch (e) {}

const base64URLEncode = str => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = buffer => {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest();
};

const loginStart = () => {
  verifier = base64URLEncode(crypto.randomBytes(32));

  const challenge = base64URLEncode(sha256(verifier));
  const req_id = base64URLEncode(crypto.randomBytes(3));
  const email = encodeURIComponent(process.env.USER_EMAIL);

  const responseUrl = encodeURIComponent("fb-workchat-sso://sso");
  return `https://m.facebook.com/work/sso/mobile?app_id=312713275593566&response_url=${responseUrl}&request_id=${req_id}&code_challenge=${challenge}&email=${email}`;
};

const isLoggedIn = () => {
  return client.loggedIn;
};

const loginAuth = (uid, nonce) => {
  client.login(uid, `${nonce}:${verifier}`).then(() => {
    // console.log(client.session);
    // fs.writeFileSync(".client_cache", serialize(client));
    fs.writeFileSync(
      ".credentials_cache",
      JSON.stringify({
        session: client.session.tokens,
        httpApi: client.httpApi.token
      })
    );
    // console.log(client.getSession().tokens);
    // client.getThreadList().then(x => {
    //   console.log(x);
    // });
  });
};

module.exports = { loginStart, loginAuth, isLoggedIn, client };
