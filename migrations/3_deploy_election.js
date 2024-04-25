const Election = artifacts.require("Election");

module.exports = function(deployer, network, accounts) {
  // You can provide the required constructor parameters here
  const authority = accounts[0];
  const name = "My Election";
  const description = "Description of my election";

  deployer.deploy(Election, authority, name, description);
};
