import express from 'express';
import cors from 'cors';
import { Authflow } from 'prismarine-auth';
import { RealmAPI } from 'prismarine-realms';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let userIDApi = "https://api.mojang.com/users/profiles/minecraft/"
let api = null; // Store authenticated API globally

// 🔹 Login Route (Trigger authentication manually)
app.post('/api/login', async (req, res) => {
    try {
        const username = 'axg014@gmail.com';  // Change this if needed
        const cacheDir = './auth_cache';  // Path to store auth tokens

        const authflow = new Authflow(username, cacheDir, { flow: 'msal', authTitle: '6af399a9-2a9e-47e1-bd6c-dced90578b4e' });
        api = RealmAPI.from(authflow, 'bedrock'); // Store API instance

        res.json({ success: true, message: "✅ Logged in successfully!" });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: "❌ Authentication failed." });
    }
});

// 🔹 Fetch Realms Route (Requires Authentication)
app.get('/api/realms', async (req, res) => {
    if (!api) {
        return res.status(401).json({ success: false, message: "❌ Not authenticated. Please log in first." });
    }

    try {
        const realms = await api.getRealms();
        let realmsData = [];
        for(let i = 0; i < realms.length; i++){
           const realmData = await api.getRealm(realms[i].id);
           realmsData.push(realmData)
         }
         let username = null;
         if (realmsData[0]?.players?.[0]?.uuid) {
           username = await getUsernameFromUUID(realmsData[0].players[0].uuid);
           console.log(username);
         }
        console.log(username)
        res.json({
          success: true,
          realms: realmsData
        });
    } catch (error) {
        console.error("❌ Error fetching realms:", error);
        res.status(500).json({ success: false, message: "❌ Failed to fetch realms." });
    }
});

async function getUsernameFromUUID(uuid) {
    try {
      const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error("Could not get username:", error);
      return null;
    }
  }
  
 


  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  }
  
  export default app;