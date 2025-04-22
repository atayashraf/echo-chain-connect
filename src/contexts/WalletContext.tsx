
import { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  
  const connectWallet = async () => {
    // In a real implementation, this would use Web3.js or ethers.js to connect to MetaMask or another wallet
    // For demo purposes, we'll just set a mock address
    setAddress("0xf3D58e5B2984a5E8802B869e5bC425Af7dd5a2B");
  };
  
  const disconnectWallet = () => {
    setAddress(null);
  };
  
  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
