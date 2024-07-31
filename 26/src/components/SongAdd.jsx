import React from "react";

import PlusCircleIcon from "./icons/PlusCircleIcon";

import "./SongAdd.css";

export default function SongAdd() {
    const [songTitle, setSongTitle] = React.useState("");

    function add() {
        fetch("http://127.0.0.1:4000/songs", {
            method: "POST",
            body: JSON.stringify({ title: songTitle }),
            headers: {
                "Content-Type": "application/json",
            },
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
                <input
                    id="title"
                    className="form-input focus"
                    placeholder="Song title"
                    onChange={(event) => setSongTitle(event.target.value)}
                />
                <button
                    className="button add-form-button focus"
                    disabled={!songTitle}
                    onClick={add}
                >
                    <PlusCircleIcon />
                    Add
                </button>
            </form>
            <div className="add-form-info">
                Enter a song title and click "Add" to add it to the playlist.
            </div>
        </>
    );
}
