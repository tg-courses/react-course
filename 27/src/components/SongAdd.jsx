import React from "react";

import PlusCircleIcon from "./icons/PlusCircleIcon";
import XCircleIcon from "./icons/XCircleIcon";
import Loader from "./Loader";

import "./SongAdd.css";

export default function SongAdd({ onSongCreate }) {
    const [songTitle, setSongTitle] = React.useState("");

    const [requestStatus, setRequestStatus] = React.useState({ type: "IDLE" });

    function add() {
        setRequestStatus({ type: "PENDING" });
        fetch("http://127.0.0.1:4000/songs", {
            method: "POST",
            body: JSON.stringify({ title: songTitle }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Server returned ${response.status}`);
            })
            .then((song) => {
                setRequestStatus({ type: "SUCCESS" });
                setSongTitle("");
                onSongCreate(song);
            })
            .catch((error) => {
                setRequestStatus({
                    type: "ERROR",
                    errorMessage: error.message,
                });
            });
    }

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
                        id="title"
                        className="form-input focus"
                        placeholder="Song title"
                        value={songTitle}
                        onChange={(event) => setSongTitle(event.target.value)}
                    />
                )}
                {requestStatus.type === "PENDING" ? (
                    <button className="button add-form-button focus">
                        <XCircleIcon />
                        Cancel
                    </button>
                ) : (
                    <button
                        className="button add-form-button focus"
                        disabled={!songTitle}
                        onClick={add}
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
