import React, { useState } from "react";
import { useSmartAccountClient } from "@account-kit/react";

 
export default function ReadAccount() {
  const [ account, setAccount ] = useState("");

  const { client } = useSmartAccountClient({ type: "MultiOwnerModularAccount" });

  const handleGetBalance = async () => {
    const address = client?.account.address;
    if (address) {
      const balance = await client?.getBalance({ address });
      console.log(balance)
      setAccount(balance.toString());
    }
  };

 
  return (
    <div>
      <p>Account: {account}</p>
      <div>
        <button onClick={() => {
            const address = client?.getAddress();
            if (address) setAccount(address);
          }}>
          getAccount
        </button>
      </div>
      <div>
        <button onClick={() => {
            const address = client?.account.address;
            if (address) setAccount(address);
          }}>
          getAccountAddress
        </button>
      </div>
      <div>
      <button onClick={handleGetBalance}>
          getBalance
        </button>
      </div>
    </div>
  );
}