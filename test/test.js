const { assert } = require("chai");

const Decentragram = artifacts.require("./Decentragram.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Decentragram", ([deployer, author, tipper]) => {
  let decentragram;
  before(async () => {
    decentragram = await Decentragram.deployed();
  });

  describe("deployment", () => {
    it("should be an instance of Decentragram", async () => {
      const address = await decentragram.address;
      assert.notEqual(address, null);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, undefined);
    });

    it("should have the name", async () => {
      const name = await decentragram.name();
      assert.equal(name, "Decentragram");
    });
  });

  describe("Images", () => {
    let result;
    const hash = "abcd1234";
    const description = "This is a test image";
    let imageCount;
    before(async () => {
      result = await decentragram.uploadImage(hash, description, {
        from: author,
      });
      imageCount = await decentragram.imageCount();
    });

    it("Create Image", async () => {
      let image = await decentragram.images(1);
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.hash, hash);
      assert.equal(event.description, description);
    });

    it("Allow users to tip", async () => {
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
      result = await decentragram.tipImageOwner(imageCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      });
      const event = result.logs[0].args;

      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipImageOwner;
      tipImageOwner = web3.utils.toWei("1", "Ether");
      tipImageOwner = new web3.utils.BN(tipImageOwner);

      const expactedBalance = oldAuthorBalance.add(tipImageOwner);
      assert.equal(newAuthorBalance.toString(), expactedBalance.toString());
    });
  });
});
