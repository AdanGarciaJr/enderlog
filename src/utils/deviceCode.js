import { Authflow } from 'prismarine-auth';
import { RealmAPI } from 'prismarine-realms';

const username = 'axg014@gmail.com';  // Your Microsoft account email
const cacheDir = './auth_cache';  // Path to store auth tokens

async function fetchRealms() {
    try {
        // Create Authflow instance
        const authflow = new Authflow(username, cacheDir, { flow: 'msal', authTitle: '6af399a9-2a9e-47e1-bd6c-dced90578b4e'}); // or 'device_code'

        // Use prismarine-realms API
        const api = RealmAPI.from(authflow, 'bedrock'); // Use 'java' if you're on Java Edition

        // Fetch list of Realms
        const realms = await api.getRealms();
        console.log("✅ Your Realms:", realms);
    } catch (error) {
        console.error("❌ Error fetching Realms:", error);
    }
}

fetchRealms();