app.post('/api/login', async (req, res) => {
    try {
        const authflow = new Authflow(username, cacheDir, { flow: 'msal', authTitle: '6af399a9-2a9e-47e1-bd6c-dced90578b4e' });
        api = RealmAPI.from(authflow, 'bedrock'); // Store authenticated API
        res.json({ success: true, message: "✅ Logged in!" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "❌ Authentication failed." });
    }
});