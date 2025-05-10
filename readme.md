
# 💌 @neelegirl/wa-api → **onimai**

✨ *Elegante & einfache WhatsApp-Bibliothek* zur Verwaltung **mehrerer Sessions** – mit **universeller `sendMessage`-Funktion** und direkter `relayMessage`-Unterstützung für Profis.

---

## 📚 Inhaltsverzeichnis

1. [📦 Installation](#-installation)  
2. [🔌 Import & Setup](#-import--setup)  
3. [📲 Session Management](#-session-management)  
4. [💬 Nachrichten senden (`sendMessage`)](#-nachrichten-senden-sendmessage)  
5. [🔧 Spezialfunktionen (`relayMessage`)](#-spezialfunktionen-relaymessage)  
6. [🎧 Listener](#-listener)  
7. [🚨 Fehlerbehandlung](#-fehlerbehandlung)

---

## 📦 Installation

```bash
npm install @neelegirl/wa-api@latest
```

---

## 🔌 Import & Setup

```js
// CommonJS
const onimai = require('@neelegirl/wa-api');

// ES Module
import * as onimai from '@neelegirl/wa-api';
```

---

## 📲 Session Management

```js
await onimai.startSession('session1');
await onimai.startSessionWithPairingCode('session2', {
  phoneNumber: '491234567890'
});
const all = onimai.getAllSession();
const one = onimai.getSession('session1');
const loaded = await onimai.loadSessionsFromStorage();
```

---

## 💬 Nachrichten senden (`sendMessage`)

```js
await onimai1.sendMessage(sessionId, jidOrPhone, content, options);
```

### ✨ Beispieltypen

| 📨 Typ        | 📘 Beschreibung              | 🧾 Inhalt Beispiel |
|--------------|------------------------------|--------------------|
| **Text**     | Einfache Nachricht           | `{ text: 'Hallo!' }` |
| **Bild**     | Bild mit Caption             | `{ image: { url: './img.png' }, caption: 'Hey' }` |
| **Video**    | Video mit Caption            | `{ video: { url: './vid.mp4' }, caption: 'Video' }` |
| **GIF**      | Loop-Video                   | `{ video: { url: './gif.mp4' }, gifPlayback: true }` |
| **Audio**    | Voice Note (OGG/Opus)        | `{ audio: fs.createReadStream('voice.ogg'), mimetype: 'audio/ogg', ptt: true }` |
| **Dokument** | PDF o.ä. senden              | `{ document: { url: './doc.pdf', filename: 'Beispiel.pdf' } }` |
| **Umfrage**  | Poll-Optionen                | `{ pollCreationMessage: { name: 'Frage?', options: [...], selectableCount: 1 } }` |
| **Reaktion** | Emoji antworten              | `{ react: { text: '❤️', key: msg.key } }` |
| **Löschen**  | Nachricht zurückziehen       | `{ delete: msg.key }` |
| **Pin**      | Nachricht anpinnen           | `{ pin: { type: 1, time: 3600, key: msg.key } }` |
| **Kontakt**  | vCard teilen                 | `{ contacts: { displayName: 'Max', contacts: [{ vcard }] } }` |
| **Standort** | Standort senden              | `{ location: { degreesLatitude: 52.52, degreesLongitude: 13.405 } }` |
| **Weiterleiten** | Nachricht weitergeben    | `{ forward: origMsg }` |
| **Status**   | Story posten                 | `{ video: { url: 'story.mp4' }, caption: 'Mein Status' }` |

---

## 🔧 Spezialfunktionen (`relayMessage`)

### Nachricht löschen (Revoke)

```js
await onimai1.relayMessage(sessionId, chatJid, {
  protocolMessage: {
    key: { remoteJid: chatJid, fromMe: true, id: targetId },
    type: 7
  }
}, { messageId: targetId });
```

### Ephemeral-Modus (24h ein/aus)

```js
await onimai1.relayMessage(sessionId, groupJid, {
  disappearingMessagesInChat: onimai.Defaults.WA_DEFAULT_EPHEMERAL
}, {});

await onimai.relayMessage(sessionId, groupJid, {
  disappearingMessagesInChat: 0
}, {});
```

### Status posten (Story)

```js
await onimai1.relayMessage(sessionId, 'status@broadcast', {
  videoMessage: { url: './story.mp4' },
  caption: 'Meine Story'
}, {
  statusJidList: ['491234567890@s.whatsapp.net']
});
```

### Weiterleiten

```js
await onimai1.relayMessage(sessionId, chatJid, {
  forward: origMsg
}, { messageId: origMsg.key.id });
```

### Profilbild ändern

```js
await onimai1.relayMessage(sessionId, userJid, {
  profilePictureChange: {
    displayPicture: fs.readFileSync('./newprofile.jpg')
  }
}, { messageId: 'updateProfile' });
```

### Chat als gelesen markieren

```js
await onimai1.relayMessage(sessionId, chatJid, {
  protocolMessage: {
    key: { remoteJid: chatJid },
    type: 3
  }
}, { messageId: 'markRead' });
```

### Eigene Nachrichten-ID festlegen

```js
await onimai1.relayMessage(
  msg.sessionId,
  msg.key.remoteJid,
  { conversation: 'Custom Message ID' },
  { messageId: `onimai${Date.now()}` }
);
```

---

## 🎧 Listener

```js
onimai.onConnected(id => console.log('✅ Online:', id));
onimai.onQRUpdated(info => console.log('📲 QR-Code:', info));
onimai.onMessageReceived(msg => console.log('📥 Nachricht:', msg));
```

---

## 🚨 Fehlerbehandlung

```js
try {
  await onimai1.sendMessage(...);
} catch (e) {
  console.error('⚠️ Fehler:', e);
}
```

---

## 👩‍💻 Autorin & Support

© 2026 **@neelegirl/wa-api**  
💌 Support: [neelehoven@gmail.com](mailto:neelehoven@gmail.com)
