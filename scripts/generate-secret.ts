import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey || apiKey.includes("TEST_API_KEY:7a76")) {
        // Check if it looks like the default/placeholder I saw earlier, but actually the user might have pastes a real test key.
        // The key in .env was "TEST_API_KEY:7a76a69ab0e1bc8b2c82bda989d840f6:c0a42981ee8298a6a3d3cba9aa0bd035"
        // This looks like a valid format (KEY:Reference:Secret part).
        // I won't block it, but I'll warn if empty.
    }

    if (!apiKey) {
        console.error("Error: CIRCLE_API_KEY is missing in .env");
        process.exit(1);
    }

    console.log("Generating 32-byte hex Entity Secret...");
    const entitySecret = crypto.randomBytes(32).toString('hex');
    console.log("Secret:", entitySecret);

    console.log("\nRegistering with Circle...");
    try {
        const res = await registerEntitySecretCiphertext({
            apiKey,
            entitySecret,
        });
        console.log("\n✅ Registration Successful!");
        console.log("Recovery File:", res.data?.recoveryFile);
        console.log("\nAction Required:");
        console.log("1. Copy the secret above.");
        console.log("2. Paste it into your .env file as CIRCLE_ENTITY_SECRET.");
    } catch (e: any) {
        console.error("\n❌ Registration failed.");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", e.response.data);
        } else {
            console.error(e.message);
        }
    }
}

main();
