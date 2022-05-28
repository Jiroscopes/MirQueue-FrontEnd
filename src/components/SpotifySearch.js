import React, { useState, useEffect } from 'react';
import SearchResult from './SearchResult';

export default function SpotifySearch({ ws }) {
    // State here, update on type and make a request each time
    const [searchParam, setSearchParam] = useState(null);
    const [currentTrackList, setCurrentTrackList] = useState(null);
    // const history = useHistory();

    useEffect(() => {
        if (searchParam) {
            searchSpotify();
        }

        // clear search on unmount
        return () => setSearchParam(null);
    });

    function handleInput(e) {
        if (e.target.value === '') {
            setCurrentTrackList(null);
        }

        setSearchParam(e.target.value);
    }

    // Make a request to spotify every input
    async function searchSpotify() {
        let username = JSON.parse(localStorage.getItem('user')).username;

        let res = await fetch(`${process.env.REACT_APP_API_URL}/api/search`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                host: 1,
                sessionCode: 'test',
                searchParam: searchParam,
            }),
        });

        const tracks = await res.json();

        // array of final song objs
        let foundSongs = [];

        tracks.forEach((track) => {
            foundSongs.push(constructTrackInfo(track));
        });

        // display found songs
        setCurrentTrackList(foundSongs);
    }

    // Take a song and return a more useful object
    function constructTrackInfo(track) {
        const trackArtists = track.artists.map((artist) => {
            return artist.name;
        });

        const trackObj = {
            name: track.name,
            uri: track.uri,
            artists: {
                ...trackArtists,
            },
        };

        return trackObj;
    }

    function displaySongs() {
        return currentTrackList.map((song) => {
            return <SearchResult ws={ws} key={song.uri} song={song} />;
        });
    }

    return (
        <>
            <p>{searchParam}</p>
            <input
                type="text"
                placeholder="Search for song"
                onChange={handleInput}
            />
            <div className="track-result-container">
                {currentTrackList ? displaySongs() : ''}
            </div>
        </>
    );
}