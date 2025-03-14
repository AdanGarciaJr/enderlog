import { Authflow } from 'prismarine-auth'
import { generateKeyPairSync } from 'crypto'
const curve = 'secp384r1'
import fetchBedrockRealms from "./fetchBedrockRealms.js"

if (process.argv.length !== 5) {
  console.log('Usage: node password.js <username> <password> <cacheDirectory>')
  process.exit(1)
}

const keypair = generateKeyPairSync('ec', { namedCurve: curve }).toString('base64')
const doAuth = async () => {
  const flow = new Authflow(process.argv[2], process.argv[4], { password: process.argv[3], flow: 'msal' })
  const XSTSToken = await flow.getMinecraftBedrockToken(keypair)
  console.log(XSTSToken)
  fetchBedrockRealms(XSTSToken);
}

doAuth()