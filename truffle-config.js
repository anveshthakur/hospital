module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
  },

  contracts_directory: './contracts/',
  contracts_build_directory : './hospital/src/abis/',

  compilers: {
    solc: {
      version: "0.6.0",    
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  }
}