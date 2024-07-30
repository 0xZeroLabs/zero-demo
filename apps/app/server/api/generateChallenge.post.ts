import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = generateRandomChallenge();
  return {
    response: response,
  };
});

function generateRandomChallenge() {
  const challengeBuffer = crypto.randomBytes(32); // 32 bytes = 256 bits
  return Array.from(new Uint8Array(challengeBuffer)); // Convert to array for JSON
}
