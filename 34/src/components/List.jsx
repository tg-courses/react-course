import React from "react";

import ArrowUpIcon from "./icons/ArrowUpIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import TrashIcon from "./icons/TrashIcon";
import PencilIcon from "./icons/PencilIcon";
import CheckIcon from "./icons/CheckIcon";
import XCircleIcon from "./icons/XCircleIcon";
import Loader from "./Loader";

import "./List.css";

export default function List({
    songs,
    highlightedSongs,
    scrolledSong,
    onDelete,
    onMove,
    onEdit,
    onSongHighlight,
    onSongScroll,
    errorMessages,
    updateMessages,
    onErrorMessageDismiss,
}) {
    const [activeSongs, setActiveSongs] = React.useState([]);

    React.useEffect(() => {
        const onAnimationEnd = (event) => {
            const songId = parseInt(event.target.dataset.songId, 10);
            const song = songs.find((song) => song.id === songId);

            if (song) {
                onSongHighlight && onSongHighlight(song);
            }
        };

        addEventListener("animationend", onAnimationEnd);
        return () => removeEventListener("animationend", onAnimationEnd);
    }, [songs]);

    React.useEffect(() => {
        if (!scrolledSong) {
            return;
        }

        const selector = '[data-song-id="' + scrolledSong.id + '"]';
        const songElement = document.querySelector(selector);
        if (!songElement) {
            return;
        }

        songElement.scrollIntoView({ behavior: "smooth" });

        if (!onSongScroll) {
            return;
        }

        const observer = new IntersectionObserver(
            () => {
                onSongScroll(scrolledSong);
            },
            { threshold: 0.9 }
        );

        observer.observe(songElement);
        return () => observer.unobserve(songElement);
    }, [scrolledSong]);

    const listItems = songs.map((song, index) => {
        const isSongActive = activeSongs.some(
            (activeSong) => activeSong.id === song.id
        );

        const isSongLocked = updateMessages[song.id] || errorMessages[song.id];

        let className = "item";

        if (isSongActive || isSongLocked) {
            className += " item-editing";
        } else {
            className += " item-normal";
        }

        if (
            Array.isArray(highlightedSongs) &&
            highlightedSongs.includes(song)
        ) {
            className += " highlight";
        }

        let songDisplay;

        if (updateMessages && updateMessages[song.id]) {
            songDisplay = <Loader>{updateMessages[song.id]}</Loader>;
        } else if (errorMessages && errorMessages[song.id]) {
            songDisplay = (
                <div className="error">
                    <div className="error-message">
                        {errorMessages[song.id]}
                    </div>
                    <button
                        onClick={() => {
                            onErrorMessageDismiss &&
                                onErrorMessageDismiss(song.id);
                        }}
                    >
                        <XCircleIcon />
                    </button>
                </div>
            );
        } else if (isSongActive) {
            songDisplay = (
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
            );
        } else {
            songDisplay = <div className="item-title">{song.title}</div>;
        }

        return (
            <li key={song.id} className={className} data-song-id={song.id}>
                <div className="item-position-buttons item-position-buttons-enabled">
                    {/* Up button */}
                    {onMove && (
                        <button
                            onClick={() => onMove(song, "up")}
                            disabled={isSongLocked || index === 0}
                            className="item-position-button"
                        >
                            <ArrowUpIcon />
                        </button>
                    )}
                    {/* Down button */}
                    {onMove && (
                        <button
                            onClick={() => onMove(song, "down")}
                            disabled={
                                isSongLocked || index === songs.length - 1
                            }
                            className="item-position-button"
                        >
                            <ArrowDownIcon />
                        </button>
                    )}
                </div>
                {songDisplay}
                <div className="item-actions">
                    {/* Delete button */}
                    {onDelete && (
                        <button
                            className="button item-action-button"
                            onClick={() => onDelete(song)}
                            disabled={isSongLocked}
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
                            disabled={isSongLocked}
                            className="button item-action-button"
                        >
                            <CheckIcon />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                setActiveSongs([...activeSongs, song])
                            }
                            disabled={isSongLocked}
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
