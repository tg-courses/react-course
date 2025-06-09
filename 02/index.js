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

const songList = document.createElement("ul");
document.body.appendChild(songList);

function setButtonStates() {
    const moveUpButtons = document.querySelectorAll("[data-action=moveUp]");
    if (moveUpButtons.length >= 1) {
        moveUpButtons[0].disabled = true;
    }

    const moveDownButtons = document.querySelectorAll("[data-action=moveDown]");
    if (moveDownButtons.length >= 1) {
        moveDownButtons[moveDownButtons.length - 1].disabled = true;
    }
}

songs.forEach((song, i) => {
    const songListItem = document.createElement("li");
    songListItem.textContent = song.title;
    songList.appendChild(songListItem);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    songListItem.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
        songListItem.remove();
        songs = songs.filter((currentSong) => currentSong.id !== song.id);
        setButtonStates();
    });

    const moveUpButton = document.createElement("button");
    moveUpButton.textContent = "Move Up";
    moveUpButton.dataset.action = "moveUp";
    songListItem.appendChild(moveUpButton);

    const moveDownButton = document.createElement("button");
    moveDownButton.textContent = "Move Down";
    moveDownButton.dataset.action = "moveDown";
    songListItem.appendChild(moveDownButton);
});

setButtonStates();
