import React from "react";

import ArrowUpIcon from "./icons/ArrowUpIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import TrashIcon from "./icons/TrashIcon";
import PencilIcon from "./icons/PencilIcon";
import CheckIcon from "./icons/CheckIcon";

import "./List.css";

export default function List({ songs, onDelete, onMove, onEdit }) {
    const [activeSong, setActiveSong] = React.useState(null);

    const listItems = songs.map((song, index) => {
        const isSongActive = activeSong && activeSong.id === song.id;

        return (
            <li
                className={
                    isSongActive ? "item item-editing" : "item item-normal"
                }
            >
                <div className="item-position-buttons item-position-buttons-enabled">
                    {/* Up button */}
                    {onMove && (
                        <button
                            onClick={() => onMove(song, "up")}
                            disabled={index === 0}
                            className="item-position-button"
                        >
                            <ArrowUpIcon />
                        </button>
                    )}
                    {/* Down button */}
                    {onMove && (
                        <button
                            onClick={() => onMove(song, "down")}
                            disabled={index === songs.length - 1}
                            className="item-position-button"
                        >
                            <ArrowDownIcon />
                        </button>
                    )}
                </div>
                {isSongActive ? (
                    <input
                        className="form-input item-input focus"
                        defaultValue={song.title}
                        onChange={(event) => {
                            setActiveSong({
                                ...song,
                                title: event.target.value,
                            });
                        }}
                    />
                ) : (
                    <div className="item-title">{song.title}</div>
                )}
                <div className="item-actions">
                    {/* Delete button */}
                    {onDelete && (
                        <button
                            className="button item-action-button"
                            onClick={() => onDelete(song)}
                        >
                            <TrashIcon />
                        </button>
                    )}
                    {/* Edit button */}
                    {isSongActive ? (
                        <button
                            onClick={() => {
                                onEdit && onEdit(activeSong);
                                setActiveSong(null);
                            }}
                            className="button item-action-button"
                        >
                            <CheckIcon />
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveSong(song)}
                            className="button item-action-button"
                        >
                            <PencilIcon />
                        </button>
                    )}
                </div>
            </li>
        );
    });

    return <ul className="content item-list focus">{...listItems}</ul>;
}
