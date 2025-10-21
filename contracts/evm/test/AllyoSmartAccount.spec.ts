import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('AllyoSmartAccount', () => {
  it('stores policy updates', async () => {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('AllyoSmartAccount');
    const contract = await factory.deploy(await owner.getAddress());
    await contract.waitForDeployment();

    const policy = {
      dailyLimit: 1n,
      timelockSeconds: 60n,
      paused: false,
      coldMode: false
    };
    await (await contract.setPolicy(policy)).wait();
    const stored = await contract.policy();
    expect(stored.dailyLimit).to.equal(policy.dailyLimit);
  });
});
