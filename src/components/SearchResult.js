import React from 'react';
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom';

export default function SearchResult({ ws, song, selected }) {
    // Contains Host & Session Name
    let params = useParams();
    let auth = useAuth();

    function addSong() {
        // Can't select something you've already selected
        if (selected) {
            return;
        }
        // Send the entire user object
        let socketMessage = {
            type: 'add_song',
            uri: song.uri,
            trackID: song.id,
            trackName: song.name,
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
            <p>{selected ? 'Added!' : 'Add +'}</p>
        </div>
    );
}
