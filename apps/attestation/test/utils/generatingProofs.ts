import path from "path";
// @ts-ignore
import * as snarkjs from "snarkjs";

import fs from "node:fs";

export const generateProof = async (
  input0: number,
  input1: number,
  file: string
): Promise<any> => {
  console.log(`Generating age proof with inputs: ${input0}, ${input1}`);

  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [input0, input1],
  };

  // Paths to the .wasm file and proving key
  const wasmPath = path.join(
    process.cwd(),
    `./circuits/build/gtoeq_js/${file}.wasm`
  );
  const provingKeyPath = path.join(
    process.cwd(),
    `./circuits/keys/${file}_final.zkey`
  );

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      wasmPath,
      provingKeyPath
    );

    // Convert the data into Solidity calldata that can be sent as a transaction
    const calldataBlob = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );

    const argv = calldataBlob
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x: string | number | bigint | boolean) => BigInt(x).toString());

    const _pA = [argv[0], argv[1]];
    const _pB = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const _pC = [argv[6], argv[7]];
    const _pubSignals = [];
    console.log(argv)

    for (let i = 8; i < argv.length; i++) {
      _pubSignals.push(argv[i]);
    }

    return { _pA, _pB, _pC, _pubSignals };
  } catch (err) {
    console.log(`Error:`, err);
    return {
      proof: "",
      publicSignals: [],
    };
  }
};

export const generateGeneralProofs = async (
  input0: number,
  input1: number,
  file: string
): Promise<any> => {
  console.log(`Generating age proof with inputs: ${input0}, ${input1}`);

  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [input0, input1],
  };

  // Paths to the .wasm file and proving key
  const wasmPath = path.join(
    process.cwd(),
    `./circuits/build/gtoeq_js/${file}.wasm`
  );
  const provingKeyPath = path.join(
    process.cwd(),
    `./circuits/keys/${file}_final.zkey`
  );

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      wasmPath,
      provingKeyPath
    );

    const verificationKey = await snarkjs.zKey.exportJson(provingKeyPath);

    return { proof, publicSignals, verificationKey };
  } catch (err) {
    console.log(`Error:`, err);
    return {
      proof: "",
      publicSignals: [],
    };
  }
};

type res = { res: any; res2: any };

async function main(): Promise<res> {
  const res = await generateProof(21, 18, "gtoeq");
  const res2 = await generateGeneralProofs(21, 18, "gtoeq");

  return { res, res2 };
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .then((a) => {
    const _a = a as res;
    fs.writeFile("./proof.json", JSON.stringify(_a.res, null, 2), (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    return;
  });

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .then((a) => {
    const _a = a as res;

    fs.existsSync("keys")
      ? console.log()
      : fs.mkdir("keys", (err) => {
          if (err) throw err;
        });
    fs.writeFile(
      "./keys/proof.json",
      JSON.stringify(_a.res2.proof, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
    fs.writeFile(
      "./keys/public.json",
      JSON.stringify(_a.res2.publicSignals, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
    fs.writeFile(
      "./keys/verification_key.json",
      JSON.stringify(_a.res2.verificationKey, null, 2),
      (err) => {
        if (err) throw err;
        console.log("The group of files have been saved to the keys folder!");
      }
    );
    return;
  });
