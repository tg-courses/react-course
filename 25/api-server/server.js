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

const server = http.createServer((req, res) => {
    if (req.url === "/songs") {
        if (req.method === "GET") {
            setTimeout(() => {
                res.writeHead(200, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                });
                res.end(JSON.stringify(songs));
            }, 2000);
            return;
        }
    }
    res.writeHead(404);
    res.end();
});
server.listen(4000);
