const express = require("express");
const app = express();
const cors = require("cors");
const {
  HashMsg,
  Signed,
  recoverPubKey,
  Verify,
  PubToAddress,
} = require("./prove");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, privateKey } = req.body;

  const hashedMsg = HashMsg(amount);
  const sign = Signed(hashedMsg, privateKey);
  const pubKey = recoverPubKey(privateKey);
  const sender = PubToAddress(pubKey);
  const isSigned = Verify(sign, hashedMsg, pubKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
