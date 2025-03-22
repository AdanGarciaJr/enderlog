import { useState, useEffect } from 'react';

function App() {
    const [realms, setRealms] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);

    // 🔹 Login to API (Triggers /api/login)
    const login = async () => {
        const res = await fetch('/api/login', { method: 'POST' });
        const data = await res.json();
        alert(data.message);

        if (data.success) {
            setLoggedIn(true);
            fetchRealms();
        }
    };

    // 🔹 Fetch Realms (Triggers /api/realms)
    const fetchRealms = async () => {
        const res = await fetch('/api/realms');
        const data = await res.json();
        if (data.success === false) {
            alert(data.message);
        } else {
            setRealms(data);
            console.log(data)
        }
    };

    useEffect(() => {
        fetchRealms();
    }, []);

    return (
        <div>
            <h1>My Minecraft Realms</h1>
            {!loggedIn && <button onClick={login}>🔑 Login to Minecraft</button>}
            <ul>
                {realms.length > 0 ? (
                    realms.map(realm => (
                        <li key={realm.id}>
                            {realm.name} (Status: {realm.state})
                            <ul>
                                {Array.isArray(realm.players) && realm.players.length > 0 ? (
                                    realm.players.map(player => (
                                        <li key={player.uuid}>
                                            {player.uuid}
                                        </li>
                                    ))
                                ) : (<p>no players</p>)}
                            </ul>
                        </li>
                    ))
                ) : (
                    <p>No Realms found or not logged in.</p>
                )}
            </ul>
        </div>
    );
}

export default App;