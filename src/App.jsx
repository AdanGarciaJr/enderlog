import { useState, useEffect } from 'react';
import { config} from './config.js';
import './App.css'

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
        <div id='content'>
            <div id="header">
                <h1 id='appName'>EnderLog</h1>
            </div>
            <div id='body'>
                {!loggedIn && <button onClick={login}>🔑 Login to Minecraft</button>}
                <h2>Realms List</h2>
                <ul >
                    {realms.length > 0 ? (
                        realms.map(realm => (
                            <li key={realm.id} id='realmsListItems'>
                                <h3>{realm.name} (Status: {realm.state})</h3>
                                <h4>Players:</h4>
                                <ul>
                                    {Array.isArray(realm.players) && realm.players.length > 0 ? (
                                        realm.players.map(player => (
                                            <li key={player.uuid}>
                                                <h5 className='playerUsername'>{config[player.uuid]}</h5> 
                                                <p>Player Permission: {player.permission}</p>
                                                <p>Online: {player.online}</p>
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
        </div>
    );
}

export default App;