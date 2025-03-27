import React from 'react';
import { useState, useEffect } from 'react';
import { config} from './config.js';
import './App.css'
import { quests } from './quests.js'

function App() {
    const [realms, setRealms] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [generatedQuests, setGeneratedQuests] = useState([]);
    const [completedQuests, setCompletedQuests] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);

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
            setRealms(data.realms);
            console.log(data.realms)
        }
    };

    const generateQuest = (category) => {
        const categoryQuests = quests[category];
        const randomQuest = categoryQuests[Math.floor(Math.random() * categoryQuests.length)];
        setGeneratedQuests((prev) => [...prev, { text: randomQuest, category, completed: false }]);
      };
    
      const toggleCompleted = (index) => {
        const updated = [...generatedQuests];
        updated[index].completed = !updated[index].completed;
        setGeneratedQuests(updated);
    
        if (updated[index].completed) {
          setCompletedQuests((prev) => [...prev, updated[index]]);
        } else {
          setCompletedQuests((prev) => prev.filter(q => q.text !== updated[index].text));
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
                <div style={{ marginTop: '2rem' }}>
          <h2>🎯 Generate Random Minecraft Quest</h2>
          {Object.keys(quests).slice(0, 4).map((category) => (
            <button key={category} onClick={() => generateQuest(category)} style={{ margin: '0.5rem' }}>
              {category}
            </button>
          ))}

          <ul style={{ marginTop: '1rem' }}>
            {generatedQuests.map((quest, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={quest.completed}
                    onChange={() => toggleCompleted(index)}
                  />
                  [{quest.category}] {quest.text}
                </label>
              </li>
            ))}
          </ul>

          <button onClick={() => setShowCompleted(!showCompleted)} style={{ marginTop: '1rem' }}>
            {showCompleted ? 'Hide Completed Quests' : 'View Completed Quests'}
          </button>

          {showCompleted && (
            <ul style={{ marginTop: '1rem' }}>
              {completedQuests.length > 0 ? (
                completedQuests.map((quest, index) => (
                  <li key={index}>✅ [{quest.category}] {quest.text}</li>
                ))
              ) : (
                <p>No quests completed yet.</p>
              )}
            </ul>
          )}
        </div>
            </div>
        </div>
    );
}

export default App;