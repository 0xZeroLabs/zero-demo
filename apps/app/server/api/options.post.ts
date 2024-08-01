import crypto from 'crypto';
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const options = await generateRegistrationOptions({
    rpName: 'ZERO Demo',
    rpID: 'localhost',
    userName: body.address,
    userDisplayName: body.address,
    timeout: 60000, // 1 minute
    attestationType: 'indirect',
  });
  
  return {
    response: options,
  };
});
