import React from "react";

import Header from "./Header";
import List from "./List";
import Search from "./Search";
import SearchCount from "./SearchCount";
import SongAdd from "./SongAdd";
import Spinner from "./Spinner";

export default function App() {
    const [songs, setSongs] = React.useState([]);

    const [filter, setFilter] = React.useState("");

    const [requestStatus, setRequestStatus] = React.useState({ type: "IDLE" });

    React.useEffect(() => {
        setRequestStatus({ type: "PENDING" });
        fetch("http://localhost:4000/songs")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Server returned ${response.status}`);
                }
            })
            .then((songs) => {
                setRequestStatus({ type: "SUCCESS" });
                setSongs(songs);
            })
            .catch((error) => {
                setRequestStatus({
                    type: "ERROR",
                    errorMessage: error.message,
                });
            });
    }, []);

    function deleteSong(song) {
        setSongs((songs) =>
            songs.filter((currentSong) => currentSong.id !== song.id)
        );
    }

    function moveSong(song, direction) {
        const currentIndex = songs.findIndex(
            (currentSong) => currentSong.id === song.id
        );

        let targetIndex;
        if (direction === "up" && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        } else if (direction === "down" && currentIndex < songs.length - 1) {
            targetIndex = currentIndex + 1;
        } else {
            return;
        }

        const currentSong = songs[currentIndex];
        const targetSong = songs[targetIndex];

        setSongs((songs) => {
            const newSongs = [...songs];

            newSongs[currentIndex] = targetSong;
            newSongs[targetIndex] = currentSong;

            return newSongs;
        });
    }

    function editSong(song) {
        setSongs((songs) => {
            return songs.map((currentSong) =>
                currentSong.id === song.id ? song : currentSong
            );
        });
    }

    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(filter.toLowerCase())
    );

    let content;

    if (requestStatus.type === "SUCCESS") {
        content = (
            <List
                songs={filteredSongs}
                onDelete={deleteSong}
                onMove={moveSong}
                onEdit={editSong}
            />
        );
    } else if (requestStatus.type === "PENDING") {
        content = (
            <div className="content">
                <div className="content-loading">
                    <Spinner />
                    Loading...
                </div>
            </div>
        );
    } else if (requestStatus.type === "ERROR") {
        content = (
            <div className="content">
                <div className="content-text">
                    Could not obtain songs: {requestStatus.errorMessage}
                </div>
            </div>
        );
    }

    return (
        <>
            <Header>
                <Search onSearch={setFilter} />
                <SearchCount
                    filteredCount={filteredSongs.length}
                    totalCount={songs.length}
                />
            </Header>
            {content}
            <SongAdd
                onSongCreate={(song) => {
                    setSongs((songs) => [...songs, song]);
                }}
            />
        </>
    );
}
