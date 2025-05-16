'use client';

import { useState, useEffect } from 'react';
import ngeohash from 'ngeohash';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{text: string, timestamp: number, username: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [geoHash, setGeoHash] = useState('');
  const [radius, setRadius] = useState(1000); // Default 1km radius
  const [userCount, setUserCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [groupNumber, setGroupNumber] = useState(1);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setGeoHash(ngeohash.encode(latitude, longitude, 9)); // Precision level 9
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Clean up expired messages every minute
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => now - msg.timestamp < 10 * 60 * 1000)); // 10 minutes
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && location) {
      const message = {
        text: newMessage,
        timestamp: Date.now(),
        username: username
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Bienvenue sur EphemeralMeet</h1>
        <p className="mb-6 text-center">
          Connectez-vous avec des personnes proches de vous via des messages éphémères
        </p>
        <div className="w-full max-w-md mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre nom d'utilisateur"
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          onClick={() => {
            if (!username.trim()) {
              alert('Veuillez entrer un nom d\'utilisateur');
              return;
            }
            setShowWelcome(false);
            if (!location) {
              alert('Veuillez activer la localisation pour continuer');
              return;
            }
            // Assigner à un groupe (1-150 = groupe 1, 151-300 = groupe 2, etc.)
            const group = Math.floor(Math.random() * 150) + 1;
            setGroupNumber(Math.floor(group / 150) + 1);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Commencer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">EphemeralMeet</h1>
        <div className="flex justify-between items-center mt-2">
          <span>GeoHash: {geoHash}</span>
          <span>Groupe {groupNumber} ({userCount}/150 utilisateurs)</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 p-2 bg-white rounded shadow">
            <p><strong>{msg.username}: </strong>{msg.text}</p>
            <small className="text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
        <div className="mt-2">
          <label className="block text-sm text-gray-700 mb-1">Radius (meters):</label>
          <select
            value={radius}
            onChange={(e) => {
              const newRadius = Number(e.target.value);
              setRadius(newRadius);
              // Recalculer le groupe basé sur le nouveau rayon
              if (location) {
                const newGeoHash = ngeohash.encode(location.lat, location.lng, 9);
                setGeoHash(newGeoHash);
                const group = Math.floor(Math.random() * 150) + 1;
                setGroupNumber(Math.floor(group / 150) + 1);
              }
            }}
            className="w-full p-2 border rounded"
          >
            <option value={100}>100m</option>
            <option value={500}>500m</option>
            <option value={1000}>1km</option>
            <option value={5000}>5km</option>
          </select>
        </div>
      </div>
    </div>
  );
}