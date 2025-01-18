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
    res.writeHead(status);
    res.end(response);
}

const server = http.createServer((req, res) => {
    if (req.url === "/songs") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "application/json");

        if (req.method === "OPTIONS") {
            respondWithStatus(res, 200, JSON.stringify({}));
            return;
        } else if (req.method === "GET") {
            setTimeout(() => {
                respondWithStatus(res, 200, JSON.stringify(songs));
            }, 2000);
            return;
        } else if (req.method === "POST") {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", () => {
                try {
                    const title = JSON.parse(body).title;
                    if (typeof title !== "string" || title === "") {
                        throw new Error("Incorrect title parameter");
                    }

                    const song = {
                        id: songs.length + 1,
                        title,
                    };

                    songs = [...songs, song];
                    setTimeout(() => {
                        respondWithStatus(res, 200, JSON.stringify(song));
                    }, 2000);
                    return;
                } catch (error) {
                    respondWithStatus(
                        res,
                        400,
                        JSON.stringify({ error: error.message })
                    );
                }
            });
            return;
        }
    }

    respondWithStatus(res, 404, JSON.stringify({ error: "Invalid route" }));
});
server.listen(4000);
