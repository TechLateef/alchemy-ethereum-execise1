const { sha256 } = require("ethereum-cryptography/sha256");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const utf8ToByte = require("utf8-bytes");

/**
 *
 * @param {String} msg -message/transaction to be hash
 * @returns hash of the message
 */
const HashMsg = (msg) => {
  return keccak256(Uint8Array.from(msg));
};

/**
 *
 * @param {String} hashedMsg the hash message to be sign
 * @param {String} privKey the private key of the person starting the transaction
 * @returns the signature and recovery bit
 */
const Signed = (hashedMsg, privKey) => {
  return secp256k1.sign(hashedMsg, privKey);
};

/**
 *
 * @param {String} privKey
 * @returns
 */
const recoverPubKey = (privKey) => {
  return secp256k1.getPublicKey(privKey, (isCompress = true));
};

/**
 *
 * @param {string} publicKey
 * @returns
 */
const GetAddress = (publicKey) => {
  return keccak256(publicKey).slice(-20);
};

/**
 *
 * @param {object} signature
 * @param {String} hashMsg
 * @param {string} pubKey
 * @returns {bool}
 */
const PubToAddress = (pubKey) => {
  return keccak256(pubKey.slice(1)).slice(-20);
};

const Verify = (signature, hashMsg, pubKey) => {
  return secp256k1.verify(signature, hashMsg, pubKey);
};

module.exports = {
  HashMsg,
  Signed,
  recoverPubKey,
  GetAddress,
  PubToAddress,
  Verify,
};
