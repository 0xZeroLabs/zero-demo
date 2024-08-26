import path from "path";
import process from "process"

export const generateProof = async (
  input0: number,
  input1: number,
  file: string
): Promise<any> => {
  const { groth16: groth16 } = await import('snarkjs');
  console.log(`Generating age proof with inputs: ${input0}, ${input1}`);

  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [input0, input1],
  };

  const wasmPath = path.join(
    process.cwd(),
    `/circuits/builds/gtoeq_js/${file}.wasm`
  );
  const provingKeyPath = path.join(
    process.cwd(),
    `/circuits/keys/${file}_final.zkey`
  );

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      wasmPath,
      provingKeyPath
    );

    // Convert the data into Solidity calldata that can be sent as a transaction
    const calldataBlob = await groth16.exportSolidityCallData(
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

// returns every file including the proof, public outputs and verification key
export const generateGeneralProofs = async (
  input0: number,
  input1: number,
  file: string
): Promise<any> => {
  const { groth16: groth16, zKey: zKey } = await import('snarkjs');
  

  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [input0, input1],
  };

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await  groth16.fullProve(
      inputs,
      `/circuits/buildss/gtoeq_js/${file}.wasm`,
      `/circuits/keys/${file}_final.zkey`
    );

    const verificationKey = await zKey.exportJson(
      `/circuits/keys/${file}_final.zkey`
    );

    return { proof, publicSignals, verificationKey };
  } catch (err) {
    console.log(`Error:`, err);
    return {
      proof: "",
      publicSignals: [],
    };
  }
};
