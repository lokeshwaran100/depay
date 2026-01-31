import forge from 'node-forge';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.CIRCLE_API_KEY;

if (!API_KEY) {
    console.error("Missing CIRCLE_API_KEY in .env");
    process.exit(1);
}

// Determine if we are on testnet or mainnet based on key format or just assume test/sandbox
// Usually sandbox keys start with "TEST_API_KEY"
const BASE_URL = "https://api.circle.com"; // Circle uses same domain, routing by key?
// Actually Sandbox is api-sandbox.circle.com?
// Let's check docs or try both. Standard is api.circle.com for production.
// For Sandbox/Testnet, it's often https://api-sandbox.circle.com
// But Circle's Web3 services might be unified.
// A common pattern: keys starting with "TEST_" use sandbox.

const isTest = API_KEY.startsWith("TEST_");
// Verify this assumption. 
// However, the safer bet is to try to fetch the public key.

async function main() {
    console.log("Fetching Entity Public Key...");

    try {
        const response = await axios.get('https://api.circle.com/v1/w3s/config/entity/publicKey', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const publicKeyPem = response.data.data.publicKey;
        console.log("Public Key fetch successful.");

        // Generate new secret
        const entitySecret = crypto.randomBytes(32).toString('hex');
        console.log("\n--- NEW ENTITY SECRET ---");
        console.log(entitySecret);
        console.log("-------------------------\n");

        // Encrypt
        const entitySecretBytes = forge.util.hexToBytes(entitySecret);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const encrypted = publicKey.encrypt(entitySecretBytes, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha256.create()
            }
        });

        const ciphertext = forge.util.encode64(encrypted);

        console.log("--- CIPHERTEXT (Paste this in Circle Console) ---");
        console.log(ciphertext);
        console.log("-------------------------------------------------");

        console.log("\nNext Steps:");
        console.log("1. Copy the CIPHERTEXT above and paste it into the 'New entity secret ciphertext' box.");
        console.log("2. Click 'Reset'.");
        console.log("3. Copy the NEW ENTITY SECRET above and update your .env file.");

    } catch (error: any) {
        console.error("Failed to fetch public key or encrypt.");
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

main();
