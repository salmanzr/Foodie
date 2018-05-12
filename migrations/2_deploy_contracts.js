var ProduceFactory = artifacts.require("./ProduceFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ProduceFactory);
};
