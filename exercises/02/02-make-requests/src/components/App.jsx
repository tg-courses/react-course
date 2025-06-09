import React from "react";

import useFetch from "../hooks/fetch";
import useMultiFetch from "../hooks/multi-fetch";
import Header from "./Header";
import List from "./List";
import Search from "./Search";
import SearchCount from "./SearchCount";
import SongAdd from "./SongAdd";
import Spinner from "./Spinner";

export default function App() {
    const [songs, setSongs] = React.useState([]);
    const [scrolledSong, setScrolledSong] = React.useState(null);
    const [highlightedSongs, setHighlightedSongs] = React.useState([]);
    const [errorMessages, setErrorMessages] = React.useState({});
    const [updateMessages, setUpdateMessages] = React.useState({});

    const [filter, setFilter] = React.useState("");

    const { requestStatus: listRequestStatus, makeRequest: makeListRequest } =
        useFetch("http://localhost:4000/songs");

    const {
        requestStatus: deleteRequestStatus,
        makeRequest: makeDeleteRequest,
        clearRequestStatus: clearDeleteRequestStatus,
    } = useMultiFetch();

    const {
        requestStatus: editRequestStatus,
        makeRequest: makeEditRequest,
        clearRequestStatus: clearEditRequestStatus,
    } = useMultiFetch();

    const { makeRequest: makeMoveRequest } = useMultiFetch();

    React.useEffect(makeListRequest, []);

    React.useEffect(() => {
        listRequestStatus.data && setSongs(listRequestStatus.data);
    }, [listRequestStatus.data]);

    React.useEffect(() => {
        setUpdateMessages({});
        setErrorMessages({});

        function processStatus(type, entries) {
            for (const [idString, status] of entries) {
                const id = parseInt(idString, 10);
                if (!id) {
                    return;
                }

                if (status.type === "PENDING") {
                    setUpdateMessages((messages) => ({
                        ...messages,
                        [id]: type === "delete" ? "Deleting..." : "Editing...",
                    }));
                } else if (status.type === "ERROR") {
                    setErrorMessages((messages) => ({
                        ...messages,
                        [id]: status.errorMessage,
                    }));
                } else if (status.type === "SUCCESS") {
                    if (type === "delete") {
                        setSongs((songs) =>
                            songs.filter((currentSong) => currentSong.id !== id)
                        );
                    } else {
                        setSongs((songs) => {
                            return songs.map((currentSong) =>
                                currentSong.id === status.data.id
                                    ? status.data
                                    : currentSong
                            );
                        });
                    }
                }
            }
        }

        processStatus("delete", Object.entries(deleteRequestStatus));
        processStatus("edit", Object.entries(editRequestStatus));
    }, [deleteRequestStatus, editRequestStatus]);

    function deleteSong(song) {
        makeDeleteRequest(song.id, "http://localhost:4000/songs/" + song.id, {
            method: "DELETE",
        });
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

        makeMoveRequest(song.id, "http://localhost:4000/songs/" + song.id, {
            method: "PATCH",
            body: JSON.stringify({ id: song.id, move: direction }),
        });
    }

    function editSong(song) {
        makeEditRequest(song.id, "http://localhost:4000/songs/" + song.id, {
            method: "PATCH",
            body: JSON.stringify({ title: song.title }),
        });
    }

    function onSongHighlight(song) {
        setHighlightedSongs((highlightedSongs) =>
            highlightedSongs.filter(
                (highlightedSong) => highlightedSong.id !== song.id
            )
        );
    }

    function onErrorMessageDismiss(id) {
        clearDeleteRequestStatus(id);
        clearEditRequestStatus(id);
    }

    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(filter.toLowerCase())
    );

    let content;

    if (listRequestStatus.type === "SUCCESS") {
        content = (
            <List
                songs={filteredSongs}
                onDelete={deleteSong}
                onMove={moveSong}
                onEdit={editSong}
                highlightedSongs={highlightedSongs}
                onSongHighlight={onSongHighlight}
                scrolledSong={scrolledSong}
                onSongScroll={() => setScrolledSong(null)}
                errorMessages={errorMessages}
                updateMessages={updateMessages}
                onErrorMessageDismiss={onErrorMessageDismiss}
            />
        );
    } else if (listRequestStatus.type === "PENDING") {
        content = (
            <div className="content">
                <div className="content-loading">
                    <Spinner />
                    Loading...
                </div>
            </div>
        );
    } else if (listRequestStatus.type === "ERROR") {
        content = (
            <div className="content">
                <div className="content-text">
                    Could not obtain songs: {listRequestStatus.errorMessage}
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
                    setHighlightedSongs((highlightedSongs) => [
                        ...highlightedSongs,
                        song,
                    ]);
                    setScrolledSong(song);
                }}
            />
        </>
    );
}
