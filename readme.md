# Onimai Multi Session - Connecting More Whatsapp Session in 1 App

Connecting Your app with Whatsapp Messaging

Lightweight library for whatsapp. Not require Selenium or any other browser.

Stand above [Baileys](https://github.com/WhiskeySockets/Baileys) Library.

## Installation

Install package using npm

```bash
npm install @neelegirl/wa-api@latest
```

Then import your code

Using JS Module

```ts
import * as onimai from "@neelegirl/wa-api";
```

or using CommonJS

```ts
const onimai = require("@neelegirl/wa-api");
```

## Session Usage/Examples

Start New Session

```ts
const session = await onimai.startSession("mysessionid");
// Then, scan QR on terminal
```

Start New Session with pairingcode

```ts
const session = await onimai.startSessionWithPairingCode("mysessionid", { phoneNumber: "4267256437" });
console.log(session);
```

Get All Session ID

```ts
const sessions = onimai.getAllSession();
```

Get Session Data By ID

```ts
const session = onimai.getSession("mysessionid");
```

Load Session From Storage / Load Saved Session

```ts
onimai.loadSessionsFromStorage();
```

## Messaging Usage/Examples

Kick a user

```ts
await onimai.kickusr({
  sessionId: "mysessionid",
  to: chatId,
  text: "436779437@s.whatsapp.net",
});
```

Send Text Message

```ts
await onimai.sendTextMessage({
  sessionId: "mysessionid",
  to: "436779437",
  isGroup: false,
  text: "Hi There, This is Message from Server!",
  Jid: ["@436779437"],
});
```

Send Image

```ts
const image = fs.readFileSync("./myimage.png");
const send = await onimai.sendImage({
  sessionId: "session1",
  to: "436779437",
  text: "My Image Caption",
  media: image,
});
```

Send Video

```ts
const video = fs.readFileSync("./myvideo.mp4");
const send = await onimai.sendVideo({
  sessionId: "session1",
  to: "436779437",
  text: "My Video Caption",
  media: video,
});
```

Send Document File

```ts
const filename = "mydocument.docx";
const document = fs.readFileSync(filename);
const send = await onimai.sendDocument({
  sessionId: "session1",
  to: "436779437",
  filename,
  media: document,
  text: "Hei, Check this Document",
});
```

Send Voice Note

```ts
const filename = "myaudio.mp3";
const audio = fs.readFileSync(filename);
const send = await onimai.sendVoiceNote({
  sessionId: "session1",
  to: "436779437",
  media: audio,
});
```

Delete a message

```ts
const send = await onimai.del({
  sessionId: "session1",
  to: "436779437",
  id: "ueifjs3230",
  sender: "439137310",
});
```

Read a Message

```ts
await onimai.readMessage({
  sessionId: "session1",
  key: msg.key,
});
```

Send Typing Effect

```ts
await onimai.sendTyping({
  sessionId: "session1",
  to: "436779437",
  duration: 3000,
});
```

## Listener Usage/Examples

Add Listener/Callback When Receive a Message

```ts
onimai.onMessageReceived((msg) => {
  console.log(`New Message Received On Session: ${msg.sessionId} >>>`, msg);
});
```

Add Listener/Callback When QR Printed

```ts
onimai.onQRUpdated(({ sessionId, qr }) => {
  console.log(qr);
});
```

Add Listener/Callback When Session Connected

```ts
onimai.onConnected((sessionId) => {
  console.log("session connected :" + sessionId);
});
```

## Handling Incoming Message Examples

```ts
onimai.onMessageReceived(async (msg) => {
  if (msg.key.fromMe || msg.key.remoteJid.includes("status")) return;
  await onimai.readMessage({
    sessionId: msg.sessionId,
    key: msg.key,
  });
  await onimai.sendTyping({
    sessionId: msg.sessionId,
    to: msg.key.remoteJid,
    duration: 3000,
  });
  await onimai.sendTextMessage({
    sessionId: msg.sessionId,
    to: msg.key.remoteJid,
    text: "Hallo!",
    answering: msg,
  });
});
```

## Save Media Message (Image, Video, Document)

```ts
onimai.onMessageReceived(async (msg) => {
  if (msg.message?.imageMessage) {
    msg.saveImage("./myimage.jpg");
  }
  if (msg.message?.videoMessage) {
    msg.saveVideo("./myvideo.mp4");
  }
  if (msg.message?.documentMessage) {
    msg.saveDocument("./mydocument");
  }
});
```

## Optional Configuration Usage/Examples

Einstellen der von ihnen gewählte speicher ort

```ts
onimai.setCredentialsDir("my_custom_dir");
```

Einstellen der von ihnen gewählte namens der session

```ts
onimai.setCredentials("_credentials");
```

## Feedback or Support

contact [neelehoven@gmail.com](mailto:neelehoven@gmail.com)
