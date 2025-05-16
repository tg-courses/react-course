const http = require("http");

let songs = [
    { id: 1, title: "Biosphere - Poa Alpina" },
    { id: 2, title: "Biosphere - Hyperborea" },
    { id: 3, title: "Brian Eno - Under Stars" },
    { id: 4, title: "Brian Eno - An Ending (Ascent)" },
    { id: 5, title: "Global Communication - 14:31" },
    { id: 6, title: "Robert Rich - Distant Traveler" },
    { id: 7, title: "Steve Roden - Forms of Paper" },
    { id: 8, title: "Workbench - Serpents" },
    { id: 9, title: "Brian Eno - Music for Airports" },
];

function respondWithStatus(res, status, response) {
    setTimeout(() => {
        res.writeHead(status);
        res.end(response);
    }, 2000);
}

function respondWithError(res, code, message) {
    respondWithStatus(res, code, JSON.stringify({ error: message }));
}

function parseBodyAsJSON(res, req, callback) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            callback(JSON.parse(body));
        } catch (error) {
            respondWithError(res, 400, error.message);
        }
    });
}

function getTitle(json) {
    const title = json.title;
        if (typeof title !== "string" || title === "") {
            throw new Error("Incorrect title parameter");
        }
    return title;
}

function findSongById(id) {
    return songs.find((song) => song.id === id);
}

function parseId(idString) {
    return idString && /^\d+$/.test(idString) ? parseInt(idString, 10) : null;
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

    const newSongs = [...songs];

    newSongs[currentIndex] = targetSong;
    newSongs[targetIndex] = currentSong;

    songs = newSongs;
}

const server = http.createServer((req, res) => {
    const [, path, idString] = req.url.split("/");

    if (path === "songs") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "OPTIONS, GET, POST, DELETE, PATCH"
        );
        res.setHeader("Content-Type", "application/json");

        if (req.method === "OPTIONS") {
            respondWithStatus(res, 200, JSON.stringify({}));
            return;
        } else if (req.method === "GET") {
            respondWithStatus(res, 200, JSON.stringify(songs));
            return;
        } else if (req.method === "POST") {
            parseBodyAsJSON(res, req, (json) => {
                const title = getTitle(json);
                const song = { id: songs.length + 1, title };
                songs = [...songs, song];
                respondWithStatus(res, 200, JSON.stringify(song));
            });
            return;
        } else if (req.method === "DELETE") {
            const id = parseId(idString);
            const foundSong = findSongById(id);
            if (foundSong) {
                songs = songs.filter((song) => song.id !== id);
                respondWithStatus(res, 200, JSON.stringify(foundSong));
            } else {
                respondWithError(res, 404, "Song not found");
            }
            return;
        } else if (req.method === "PATCH") {
            const id = parseId(idString);
            const foundSong = findSongById(id);
            if (foundSong) {
                parseBodyAsJSON(res, req, (json) => {
                    const moveDirection = json.move;
                    if (moveDirection) {
                        moveSong(foundSong, moveDirection);
                        respondWithStatus(res, 200);
                    } else {
                        const title = getTitle(json);
                    const updatedSong = { ...foundSong, title };
                    songs = songs.map((song) => {
                        return song.id === id ? updatedSong : song;
                    });
                        const jsonString = JSON.stringify(updatedSong);
                        respondWithStatus(res, 200, jsonString);
                    }
                });
            } else {
                respondWithError(res, 404, "Song not found");
            }
            return;
        }
    }

    respondWithError(res, 404, "Invalid route");
});
server.listen(4000);
