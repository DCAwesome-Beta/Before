import React from "react";
import {
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react";
import { encodeFunctionData, Hex, parseAbi } from "viem";
 
export default function SetGreetingComponent() {
  const { client } = useSmartAccountClient({ type: "MultiOwnerModularAccount" });

//   const [greeting, setGreeting] = React.useState("eth global");
  const [greeting, setGreeting] = React.useState("eth global");


  const abi = parseAbi([
    'function greet() public view returns (string memory)',
    'function setGreeting(string memory _greeting) public',
    'function createGreeter(string memory _greeting, bytes32 _salt) public'
  ])

  const cd = encodeFunctionData({
    abi: abi,
    functionName: "setGreeting",
    args: [greeting],
  })

 
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    // optional parameter that will wait for the transaction to be mined before returning
    waitForTxn: true,
    onSuccess: async ({ hash, request }) => {
      console.log(hash);

      // let address: Hex = "0xb7c8ba8ef5a638a1d21402d3aff99401c74f6ba9";

      // console.log("Transaction hash:", hash);
      const receipt = await client?.getTransactionReceipt({hash});
      console.log(receipt);

      let greeterAddress: Hex | undefined = "0xb7c8ba8ef5a638a1d21402d3aff99401c74f6ba9";

      const res = await client?.readContract({
        address: greeterAddress ?? "0xb7c8ba8ef5a638a1d21402d3aff99401c74f6ba9",
        abi: abi,
        functionName: "greet",
      });
      console.log(res);
    },
    onError: async (e, request) => {
      console.error(e);
    },
  });
 
  return (
    <div>
      <input
        type="text"
        placeholder="Enter new greeting"
        onChange={(e) => {
          const newGreeting = e.target.value;
          setGreeting(newGreeting);
        }}
        style={{ color: 'black' }}
      />
      <button
        onClick={() =>
          sendUserOperation({
            uo: [
              {
                target: "0xb7c8ba8ef5a638a1d21402d3aff99401c74f6ba9",
                data: cd,
                value: 0n,
              },
          ],
          overrides: {
            maxPriorityFeePerGas: 50000000000n,
            maxFeePerGas: 2000000000000n,
          },
          })
        }
        disabled={isSendingUserOperation}
      >
        {isSendingUserOperation ? "Sending..." : "SetGreeting"}
      </button>
    </div>
  );
}