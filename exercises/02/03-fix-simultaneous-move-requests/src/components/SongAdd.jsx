import React from "react";

import PlusCircleIcon from "./icons/PlusCircleIcon";
import XCircleIcon from "./icons/XCircleIcon";
import Loader from "./Loader";
import useFetch from "../hooks/fetch";

import "./SongAdd.css";

export default function SongAdd({ onSongCreate }) {
    const [songTitle, setSongTitle] = React.useState("");

    const {
        requestStatus,
        makeRequest: addSong,
        cancelRequest,
    } = useFetch("http://localhost:4000/songs", {
        method: "POST",
        body: JSON.stringify({ title: songTitle }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const titleInputRef = React.useRef(null);

    React.useEffect(() => {
        if (requestStatus.type === "ERROR") {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        } else if (requestStatus.type === "SUCCESS") {
            setSongTitle("");
            onSongCreate(requestStatus.data);
        }
    }, [requestStatus.type]);

    return (
        <>
            <form
                className="add-form"
                onSubmit={(event) => event.preventDefault()}
            >
                <label htmlFor="title" className="cursor-pointer">
                    New song:
                </label>
                {requestStatus.type === "PENDING" ? (
                    <Loader>Adding...</Loader>
                ) : (
                    <input
                        ref={titleInputRef}
                        id="title"
                        className="form-input focus"
                        placeholder="Song title"
                        value={songTitle}
                        onChange={(event) => setSongTitle(event.target.value)}
                    />
                )}
                {requestStatus.type === "PENDING" ? (
                    <button
                        className="button add-form-button focus"
                        onClick={cancelRequest}
                    >
                        <XCircleIcon />
                        Cancel
                    </button>
                ) : (
                    <button
                        className="button add-form-button focus"
                        disabled={!songTitle}
                        onClick={addSong}
                    >
                        <PlusCircleIcon />
                        Add
                    </button>
                )}
            </form>
            {requestStatus.type === "ERROR" ? (
                <div className="add-form-error">
                    The song could not be added: {requestStatus.errorMessage}
                </div>
            ) : (
                <div className="add-form-info">
                    Enter a song title and click "Add" to add it to the
                    playlist.
                </div>
            )}
        </>
    );
}
