import { getClient } from '@/config';
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react';
import { useState, useEffect } from 'react';
import { decodeEventLog, encodeFunctionData, Hex, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

// Define the custom hook
export const useStrategyAddress = (data: { options: any; amounts: any; newAmounts: any; }) => {
  const [strategyAddress, setStrategyAddress] = useState<Hex | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const factoryAbi = parseAbi([
    'function createStrategy(address owner,uint256 amount) external',
    `function getStrategy(address owner) external view returns (address)`,
    `event StrategyCreated(address strategyAddress)`
  ]);

  const sepoliaClient = getClient(sepolia);
  const { client } = useSmartAccountClient({ type: "MultiOwnerModularAccount" });
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    // optional parameter that will wait for the transaction to be mined before returning
    waitForTxn: true,
    onSuccess: async ({ hash, request }) => {
      console.log(`tx hash:${hash}`);

      const receipt = await client?.getTransactionReceipt({hash});
      console.log(`receipt ${receipt}`);

      if (receipt) {
        const logs = receipt?.logs
        .map((log) => {
          try {
            const decoded = decodeEventLog({
              abi: factoryAbi,
              data: log.data,
              topics: log.topics
            });

            console.log(decoded);

            // return decoded.eventName === "GreeterCreated";

            if (decoded.eventName === "StrategyCreated") {
              return decoded.args.strategyAddress;
            }

          } catch (e) {
            console.error(e);
            return null
          }
        });

        // console.log(logs);

        setStrategyAddress(logs.find((log) => log !== undefined) ?? null);
        setLoading(false);
      }
    },
    onError: async (e, request) => {
      console.error(e);
      setError(`Error fetching strategy address: ${e}`);
    },
  });

  useEffect(() => {
    const fetchStrategyAddress = async () => {
      try {
        // Initialize the Sepolia client
        // const sepoliaClient = getClient('sepolia');

        // Fetch the strategy address using the client
        const address: Hex = await sepoliaClient.readContract({
          address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS! as Hex,
          abi: factoryAbi,
          args: ['0x0'],  // Arguments for the function call
          functionName: 'getStrategy',  // Function name to call
        });

        console.log(address);

        if (address === '0x0000000000000000000000000000000000000000') {

          const cd = encodeFunctionData({
            abi: factoryAbi,
            functionName: "createStrategy",
            args: ["0x0000000000000000000000000000000000000000", 1000000000000000000n],
          })

          sendUserOperation({
            uo: [
              {
                target: process.env.NEXT_PUBLIC_FACTORY_ADDRESS! as Hex,
                data: cd,
                value: 0n,
              },
          ],
          overrides: {
            // callGasLimit: 1000000n,
            maxPriorityFeePerGas: 50000000000n,
            maxFeePerGas: 2000000000000n,
          },
          })
        } else {

          setStrategyAddress(address);
          setLoading(false);
        }
      } catch (e) {
        setError(`Error fetching strategy address: ${e}`);
        setLoading(false);
      }
    };

    // Call the function to fetch strategy address
    fetchStrategyAddress();
  }, [factoryAbi, sepoliaClient, sendUserOperation, isSendingUserOperation]);

  return { strategyAddress, loading, error };
};
