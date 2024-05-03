import { Wallet } from "ethers";
import http from "redaxios";
import lineByLine from "n-readlines";

async function start() {
  const liner = new lineByLine("addresses.txt");
  let line;
  while ((line = liner.next())) {
    try {
      const data = await markAsSybil(line);
      console.log(data);
    } catch {
      console.log("private key is invalid");
    }
  }
}

start();

async function markAsSybil(key) {
  const wallet = new Wallet(key);
  const message = "This is a sybil address";
  const signature = await wallet.signMessage(message);

  const { data } = await http.post(
    "https://sybil.layerzero.network/api/report",
    {
      chainType: "evm",
      signature,
      message,
      address: wallet.address,
    }
  );

  return data;
}
