import React from "react";
import { useChain } from "@account-kit/react";
import { mainnet, sepolia } from "@account-kit/infra";
import { Chain } from "viem";
 
export default function SwapChain() {
  const { chain, setChain } = useChain();
 
  return (
    <div>
      <p>Current chain: {chain.name}</p>
      <div>
        <button onClick={() => setChain({ chain: mainnet as Chain })}>
          Switch to Mainnet
        </button>
      </div>
      <div>
        <button onClick={() => setChain({ chain: sepolia as Chain })}>
          Switch to Sepolia
        </button>
      </div>
    </div>
  );
}