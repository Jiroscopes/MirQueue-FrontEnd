import React from 'react';
// import { addItemToQueue } from '../utils'
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom';

export default function SearchResult({ ws, song }) {
    // Contains Host & Session Name
    let params = useParams();
    let auth = useAuth();

    function addSong() {
        // Send the entire user object
        let socketMessage = {
            type: 'add_song',
            uri: song.uri,
            user: auth.user,
            session: params,
        };

        ws.current.send(JSON.stringify(socketMessage));
    }

    return (
        <div className="search-result-container" onClick={addSong}>
            <div>
                <p>{song.name}</p>
                {Object.values(song.artists).map((artist) => {
                    return (
                        <p key={artist} className="artists">
                            {artist}
                        </p>
                    );
                })}
            </div>
            <p>Add +</p>
        </div>
    );
}
