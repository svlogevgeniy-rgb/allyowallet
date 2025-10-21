import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.23',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    anvil: {
      url: process.env.ETHEREUM_RPC_URL || 'http://127.0.0.1:8545'
    },
    bsc: {
      url: process.env.BSC_RPC_URL || 'https://bsc-testnet.publicnode.com'
    }
  }
};

export default config;
