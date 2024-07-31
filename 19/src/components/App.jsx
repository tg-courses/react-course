import React from "react";

import Header from "./Header";
import List from "./List";
import Search from "./Search";
import SearchCount from "./SearchCount";

export default function App() {
    const [songs, setSongs] = React.useState([
        { id: 1, title: "Biosphere - Poa Alpina" },
        { id: 2, title: "Biosphere - Hyperborea" },
        { id: 3, title: "Brian Eno - Under Stars" },
        { id: 4, title: "Brian Eno - An Ending (Ascent)" },
        { id: 5, title: "Global Communication - 14:31" },
        { id: 6, title: "Robert Rich - Distant Traveler" },
        { id: 7, title: "Steve Roden - Forms of Paper" },
        { id: 8, title: "Workbench - Serpents" },
        { id: 9, title: "Brian Eno - Music for Airports" },
    ]);

    const [filter, setFilter] = React.useState("");

    function deleteSong(song) {
        setSongs((songs) =>
            songs.filter((currentSong) => currentSong.id !== song.id)
        );
    }

    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(filter.toLowerCase())
    );

    return [
        <Header>
            <Search onSearch={setFilter} />
            <SearchCount
                filteredCount={filteredSongs.length}
                totalCount={songs.length}
            />
        </Header>,
        <List songs={filteredSongs} onDelete={deleteSong} />,
    ];
}
