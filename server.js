const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const classes = require("./classes.js");

// MARK: Server Initialization
const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// MARK: Sockets
let players = [];
let deprecatedTalon = [];
let games = [];
let deprecatedCurrentGame; // Should be replaced
let deprecatedTrumpCard;
let i = 0;

io.on("connection", (socket) => {
    players.push(new classes.Player(socket));
    console.log(`${players.length} | New client connected (${socket.id})`);
    io.emit("setPlayerCount", players.length);

    let message = `Hello Client ${socket.id}`;
    socket.emit("onConnect", message);

    socket.on("joinLobby", (data) => {
        let currentPlayer = players.find((element) => element.socket.id === socket.id);
        currentPlayer.username = data.username;
        currentPlayer.lobbycode = data.lobbycode;

        let playerInformation;

        if (!games.find((element) => element.lobbycode === data.lobbycode)) {
            console.log(`Creating game with lobbycode ${data.lobbycode}`);
            let newGame = new classes.Game([currentPlayer], data.lobbycode);
            games.push(newGame);
        } else {
            console.log(`Found game with lobby ${data.lobbycode}`);
            let currentGame = games.find((element) => element.lobbycode === data.lobbycode);
            currentGame.players.push(currentPlayer);
        }
        socket.join(data.lobbycode);
        shareLobbyInformation(currentPlayer.lobbycode);
    });

    socket.on("backToLogin", () => {
        resetPlayer(socket);
    });

    socket.on("getReady", () => {
        let currentPlayer = players.find((element) => element.socket.id === socket.id);
        currentPlayer.ready = true;

        shareLobbyInformation(currentPlayer.lobbycode);
    });

    socket.on("playCard", (data) => {
        // console.log(`Somebody played this card: ${data.type} ${data.value}`);
        let player = players.find((element) => element.socket == socket);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        if (currentGame.order[0] === player && player != undefined) {
            switch (currentGame.opening) {
                case "AndereAlteHat":
                    processAndereAlteHat(socket, data, player);
                    break;
                case "GeElfen":
                    processGeElfen(socket, data, player);
                    break;
                case "HöherHat":
                    processHöherHat(socket, data, player);
                    break;
                case "AufDissle":
                    break;
                default:
                    for (let i = 0; i < player.cards.length; i++) {
                        if (
                            data.type === player.cards[i].type &&
                            data.value === player.cards[i].value
                        ) {
                            player.cards.splice(i, 1);
                            break;
                        }
                    }
                    player.playedCard = data;
                    currentGame.playedCards.push(data);
                    io.in(currentGame.lobbycode).emit("setPlayedCards", currentGame.playedCards);

                    currentGame.order.shift();
                    break;
            }
        } else {
            io.in(currentGame.lobbycode).emit("setPlayedCards", currentGame.playedCards);
            socket.emit("setYourCards", player.cards);
        }
    });

    socket.on("AndereAlteHat", () => {
        let player = players.find((element) => element.socket == socket);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        currentGame.opening = "AndereAlteHat";
        console.log("AndereAlteHat");
        io.to(socket.id).emit("closeOpening", "");
        // Set GameOpening
    });

    socket.on("GeElfen", () => {
        let player = players.find((element) => element.socket == socket);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        currentGame.opening = "GeElfen";
        console.log("GeElfen");
        io.to(socket.id).emit("closeOpening", "");
        // Set GameOpening
    });

    socket.on("HöherHat", () => {
        let player = players.find((element) => element.socket == socket);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        currentGame.opening = "HöherHat";
        console.log("HöherHat");
        io.to(socket.id).emit("closeOpening", "");
        // Set GameOpening
    });

    socket.on("AufDissle", () => {
        let player = players.find((element) => element.socket == socket);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        currentGame.opening = "AufDissle";
        console.log("AufDissle");
        io.to(socket.id).emit("closeOpening", "");
        // Set GameOpening
    });

    socket.on("template", () => {
        // Do something
    });

    socket.on("disconnect", () => {
        resetPlayer(socket);
        players = players.filter((player) => player.socket.id !== socket.id);
        console.log(`${players.length} | Client disconnected (${socket.id})`);
    });
});

function tryToStartGame(lobbycode) {
    let currentGame = games.find((element) => element.lobbycode === lobbycode);
    let amountPlayers = 0;
    let amountReadyPlayers = 0;

    currentGame.players.map((player) => {
        if (player.ready) amountReadyPlayers++;
        amountPlayers++;
    });

    console.log(
        `Trying to start a game for lobbycode ${lobbycode} | ${amountPlayers} - ${amountReadyPlayers}`
    );

    if (amountPlayers === 0) return;
    if (amountPlayers !== amountReadyPlayers) return;

    // START A GAME

    currentGame.players[0].vorhand = true;

    currentGame.talon = createTalon();
    io.in(lobbycode).emit("setTalon", currentGame.talon);

    currentGame.trumpCard = chooseTrumpCard(lobbycode);
    io.in(lobbycode).emit("setTrumpCard", currentGame.trumpCard);

    currentGame.players.forEach((player) => {
        drawCard(lobbycode, 5, player);
        io.to(player.socket.id).emit("setYourCards", player.cards);
    });

    io.in(lobbycode).emit("setTalon", currentGame.talon);

    io.to(currentGame.players[0].socket.id).emit("openOpening", "");

    io.in(lobbycode).emit("startGame", "");
    console.log(`Started a game for lobbycode ${lobbycode}`);
}

function shareLobbyInformation(lobbycode) {
    if (lobbycode === "") return;
    let currentGame = games.find((element) => element.lobbycode === lobbycode);

    // Send new playerLists to all other players
    playerInformation = currentGame.players.map((player) => {
        return { username: player.username, wins: player.wins };
    });

    let amountReadyPlayers = 0;
    currentGame.players.map((player) => {
        if (player.ready) amountReadyPlayers++;
    });

    io.in(lobbycode).emit("lobbyInformation", {
        lobbycode: lobbycode,
        amountReadyPlayers: amountReadyPlayers,
        playerInformation: playerInformation,
    });

    tryToStartGame(lobbycode);
}

function resetPlayer(socket) {
    let currentPlayer = players.find((element) => element.socket === socket);

    // Remove player from his lobby
    if (currentPlayer.lobbycode !== "") {
        let currentGame = games.find((element) => element.lobbycode === currentPlayer.lobbycode);

        currentGame.players = currentGame.players.filter(
            (player) => player.socket.id !== socket.id
        );
        currentGame.order = currentGame.order.filter((player) => player.socket.id !== socket.id);

        shareLobbyInformation(currentGame.lobbycode);

        if (currentGame.players.length < 1) {
            games = games.filter((game) => game.lobbycode !== currentGame.lobbycode);
        }
    }

    // Reset player information
    currentPlayer.username = "";
    currentPlayer.lobbycode = "";
    currentPlayer.wins = 0;
    currentPlayer.ready = false;
}

function processAndereAlteHat(socket, data, player) {
    if (player === deprecatedCurrentGame.players[0]) {
        if (data.value === "A") {
            player.playedCard = data;
            deprecatedCurrentGame.playedCards.push(data);
            io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
            deprecatedCurrentGame.order.shift();
        } else {
            io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
        }
    } else {
        player.playedCard = data;
        deprecatedCurrentGame.playedCards.push(data);
        io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
        deprecatedCurrentGame.order.shift();
    }
    if (deprecatedCurrentGame.order.length === 0) {
        if (deprecatedCurrentGame.playedCards.filter((card) => card.value === "A").length == 1) {
            console.log(players[0] + " Won");
        } else {
            let winner = deprecatedCurrentGame.players
                .slice(1)
                .filter((player) => player.playedCard == deprecatedCurrentGame.playedCards[0]);

            console.log(winner + "won (other dude)");
        }
    }
}

function processGeElfen(socket, data, player) {
    if (player === deprecatedCurrentGame.players[0]) {
        if (data.value === "A") {
            player.playedCard = data;
            deprecatedCurrentGame.playedCards.push(data);
            io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
            deprecatedCurrentGame.order.shift();
        } else {
            io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
        }
    } else {
        player.playedCard = data;
        deprecatedCurrentGame.playedCards.push(data);
        io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
        deprecatedCurrentGame.order.shift();
    }
    if (deprecatedCurrentGame.order.length === 0) {
        let beginnerPlayer = deprecatedCurrentGame.players.filter(
            (player) => player.vorhand == true
        );
        let notBeginnerPlayer = deprecatedCurrentGame.players.filter(
            (player) => player.vorhand == false
        );
        let playerWithHighestPoints = null;
        notBeginnerPlayer.forEach((player) => {
            if (
                player.playedCard.type === beginnerPlayer.Player.playedCard.type &&
                player.playedCard.value > beginnerPlayer.Player.playedCard.value
            ) {
                playerWithHighestPoints = player;
            }
        });
        if ((playerWithHighestPoints = null)) {
            console.log(beginnerPlayer + "won");
        } else {
            console.log(playerWithHighestPoints + "won (other dude)");
        }
    }
}

function processHöherHat(socket, data, player) {
    if (player === deprecatedCurrentGame.players[0]) {
        if (data.value !== "A" && data.type !== deprecatedTrumpCard.type) {
            player.playedCard = data;
            deprecatedCurrentGame.playedCards.push(data);
            io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
            deprecatedCurrentGame.order.shift();
        } else {
            io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
        }
    } else {
        player.playedCard = data;
        deprecatedCurrentGame.playedCards.push(data);
        io.emit("setPlayedCards", deprecatedCurrentGame.playedCards);
        deprecatedCurrentGame.order.shift();
    }
    if (deprecatedCurrentGame.order.length === 0) {
        console.log(players[0] + " Won");
    }
}

function createTalon() {
    let types = ["Eichel", "Blatt", "Herz", "Schellen"];
    // let types: string[] = ["Eichel"];
    let values = ["7", "U", "O", "K", "10", "A"];
    let newTalon = [];

    types.forEach((type) =>
        values.forEach((value) => {
            newTalon.push(new classes.Card(type, value));
        })
    );
    newTalon.push(...newTalon);
    newTalon = fisherYatesShuffle(newTalon);

    return newTalon;
}

// Reliable shuffling algorithm
// Source: https://www.delftstack.com/de/howto/javascript/shuffle-array-javascript/
function fisherYatesShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function chooseTrumpCard(lobbycode) {
    let currentGame = games.find((element) => element.lobbycode === lobbycode);

    let newTrumpCard = currentGame.talon[currentGame.talon.length - 1];
    currentGame.talon.slice(0, currentGame.talon.length - 1);

    return newTrumpCard;
}

function drawCard(lobbycode, amount, player) {
    let currentGame = games.find((element) => element.lobbycode === lobbycode);

    if (player.cards.length < 5 && currentGame.talon.length > 0) {
        // Gets last cards of the deprecatedTalon array and removes them
        let drawnCards = currentGame.talon.slice(currentGame.talon.length - amount);
        currentGame.talon = currentGame.talon.slice(0, currentGame.talon.length - amount);

        let newUserCards = player.cards;
        drawnCards.forEach((card) => {
            newUserCards.push(card);
        });

        newUserCards.sort((a, b) => {
            const points = new Map();
            points.set("7", 0);
            points.set("U", 2);
            points.set("O", 3);
            points.set("K", 4);
            points.set("10", 10);
            points.set("A", 11);
            if (points.get(a.value) < points.get(b.value)) {
                return -1;
            }
            if (points.get(a.value) > points.get(b.value)) {
                return 1;
            } else {
                return 0;
            }
        });

        newUserCards.sort((a, b) => {
            const trump = new Map();
            trump.set("Eichel", 0);
            trump.set("Blatt", 1);
            trump.set("Herz", 2);
            trump.set("Schellen", 3);

            if (currentGame.talon.type === a.type || currentGame.talon.type === b.type) {
                trump.set(currentGame.talon.type, 5);
            }
            if (trump.get(a.value) < trump.get(b.value)) {
                return -1;
            }
            if (trump.get(a.value) > trump.get(b.value)) {
                return 1;
            } else {
                return 0;
            }
        });
    }
}
