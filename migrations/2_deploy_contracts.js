const Hospital = artifacts.require("Hospital.sol");

module.exports = function(deployer) {
  deployer.deploy(Hospital);
};
