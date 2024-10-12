import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { mainnet, sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import { Chain, createPublicClient, http } from "viem";


const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" as const }],
      // [{ type: "external_wallets" }],
    ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    // policyId: "ac766f76-83c9-4a7a-9c06-b5f34d2cd14b", 
    chain: sepolia as Chain,
    chains: [
      {
        chain: mainnet as Chain, 
      },
      {
        chain: sepolia as Chain,
        policyId: "ac766f76-83c9-4a7a-9c06-b5f34d2cd14b",
      },
    ],
    ssr: true,
    storage: cookieStorage,
  },
  uiConfig
);

export const queryClient = new QueryClient();

export const getClient = (chain: Chain) => {
  return createPublicClient({ 
    chain: chain, 
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`), 
});
};
