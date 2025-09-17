// frontend/src/hooks/useEncryption.js
import nacl from "tweetnacl";
import * as util from "tweetnacl-util";

export function generateKeyPair() {
  return nacl.box.keyPair();
}


export function encryptMessage(senderKeyPair, receiverPublicKey, message) {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const box = nacl.box(
    util.decodeUTF8(message),
    nonce,
    receiverPublicKey,
    senderKeyPair.secretKey
  );
  return {
    nonce: util.encodeBase64(nonce),
    ciphertext: util.encodeBase64(box),
    senderPublicKey: util.encodeBase64(senderKeyPair.publicKey),
  };
}

export function decryptMessage(receiverKeyPair, data) {
  const nonce = util.decodeBase64(data.nonce);
  const ciphertext = util.decodeBase64(data.ciphertext);
  const senderPublicKey = util.decodeBase64(data.senderPublicKey);

  const decrypted = nacl.box.open(
    ciphertext,
    nonce,
    senderPublicKey,
    receiverKeyPair.secretKey
  );
  return decrypted ? util.encodeUTF8(decrypted) : null;
}
