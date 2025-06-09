import React from "react";

import ArrowUpIcon from "./icons/ArrowUpIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import TrashIcon from "./icons/TrashIcon";
import PencilIcon from "./icons/PencilIcon";
import CheckIcon from "./icons/CheckIcon";

import "./List.css";

export default function List({ songs, onDelete, onMove, onEdit }) {
    const [activeSongs, setActiveSongs] = React.useState([]);

    const listItems = songs.map((song, index) => {
        const isSongActive = activeSongs.some(
            (activeSong) => activeSong.id === song.id
        );

        return (
            <li
                key={song.id}
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
                            setActiveSongs((activeSongs) =>
                                activeSongs.map((activeSong) =>
                                    activeSong.id === song.id
                                        ? {
                                              ...activeSong,
                                              title: event.target.value,
                                          }
                                        : activeSong
                                )
                            );
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
                                onEdit &&
                                    onEdit(
                                        activeSongs.find(
                                            (activeSong) =>
                                                activeSong.id === song.id
                                        )
                                    );
                                setActiveSongs((activeSongs) =>
                                    activeSongs.filter(
                                        (activeSong) =>
                                            activeSong.id !== song.id
                                    )
                                );
                            }}
                            className="button item-action-button"
                        >
                            <CheckIcon />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                setActiveSongs([...activeSongs, song])
                            }
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
