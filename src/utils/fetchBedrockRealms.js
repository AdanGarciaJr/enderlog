import axios from 'axios';

const fetchBedrockRealms = async (mcToken) => {
    try {
        const response = await axios.get('https://pocket.realms.minecraft.net/worlds', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${mcToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Minecraft/1.21.62 (Windows10)'
            }
        });
        console.log("Realms Data:", response.data);
    } catch (error) {
        console.error("❌ Error fetching Realms: ", error);
    }
};

// Call the function with the extracted mcToken
fetchBedrockRealms(mcToken);