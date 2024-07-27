import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const omID = buildModule("omID", (m: { contract: (arg0: string) => any; }) => {
  const omID = m.contract("omID");

  return { omID };
});

export default omID;
