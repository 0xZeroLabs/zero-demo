const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;

describe("GtoEq circuit", function () {
  let multiplierCircuit;

  before(async function () {
    multiplierCircuit = await wasm_tester("./circuits/circuit/gtoeq.circom");
  });

  it("Should generate the witness successfully", async function () {
    const input = { in: [21, 18] };
    const witness = await multiplierCircuit.calculateWitness(input);
    await multiplierCircuit.assertOut(witness, {});
  });

  it("Should fail because there is a number out of bounds", async function () {
    const input = { in: [4, 5, 7] };
    try {
      await multiplierCircuit.calculateWitness(input);
      await multiplierCircuit.assertOut(witness, {});
    } catch (err) {
      //   console.log(err);
      assert(err.message.includes("Too many values for input signal in"));
    }
  });
  it("Should fail because input values ar less than expected", async function () {
    const input = {
      in: [4],
    };
    try {
      await multiplierCircuit.calculateWitness(input);
      await multiplierCircuit.assertOut(witness, {});
    } catch (err) {
      //   console.log(err);
      assert(err.message.includes("Not enough values for input signal in"));
    }
  });
  it("Should pass because both the numbers are equal", async function () {
    const input = {
      in: [18, 18],
    };
    const witness = await multiplierCircuit.calculateWitness(input);
    await multiplierCircuit.assertOut(witness, { out: 1 });
  });
  it("Should fail because the public input is greater than the secret", async function () {
    const input = {
      in: [18, 21],
    };
    const witness = await multiplierCircuit.calculateWitness(input);
    await multiplierCircuit.assertOut(witness, { out: 0 });
  });
});
