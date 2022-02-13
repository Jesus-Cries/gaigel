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
let games = [];
const pointsMap = new Map();
pointsMap.set("7", 0);
pointsMap.set("U", 2);
pointsMap.set("O", 3);
pointsMap.set("K", 4);
pointsMap.set("10", 10);
pointsMap.set("A", 11);
let i = 0;

io.on("connection", (socket) => {
    players.push(new classes.Player(socket));
    console.log(`${players.length} | New client connected (${socket.id})`);

    let message = `Hello Client ${socket.id}`;
    socket.emit("onConnect", message);

    // Logic for joining / creating a lobby
    socket.on("joinLobby", (data) => {
        let gameToJoin = games.find((element) => element.lobbycode === data.lobbycode);

        if (gameToJoin?.ongoing) {
            socket.emit("setWarningType", { type: "gameOngoing", detail: "" });
            return;
        }

        let currentPlayer = players.find((element) => element.socket.id === socket.id);
        currentPlayer.username = data.username;
        currentPlayer.lobbycode = data.lobbycode;

        if (!gameToJoin) {
            console.log(`Creating game with lobbycode ${data.lobbycode}`);
            let newGame = new classes.Game([currentPlayer], data.lobbycode);
            games.push(newGame);
        } else {
            console.log(`Found game with lobby ${data.lobbycode}`);
            gameToJoin.players.push(currentPlayer);
        }
        socket.emit("setLoggedIn", true);
        socket.join(data.lobbycode);
        shareLobbyInformation(currentPlayer.lobbycode);
    });

    // Is called when a player leaves a lobby by clicking the back button
    socket.on("backToLogin", () => {
        resetPlayer(socket);
    });

    // Is called whenever a player presses the ready button
    socket.on("getReady", () => {
        let currentPlayer = players.find((element) => element.socket.id === socket.id);
        currentPlayer.ready = true;

        shareLobbyInformation(currentPlayer.lobbycode);
    });

    // This function contains most of the game logic
    socket.on("playCard", (data) => {
        let player = players.find((element) => element.socket == socket);
        console.log(`${player.username} played this card: ${data.type} ${data.value}`);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        if (currentGame !== undefined && currentGame.order[0] === player && player !== undefined) {
            switch (currentGame.opening) {
                case "AndereAlteHat":
                    processAndereAlteHat(socket, data, player, currentGame);
                    break;
                case "GeElfen":
                    processGeElfen(socket, data, player, currentGame);
                    break;
                case "HöherHat":
                    processHöherHat(socket, data, player, currentGame);
                    break;
                case "AufDissle":
                    break;
                default:
                    // Normal round
                    if (
                        player.vorhand &&
                        currentGame.opening == "AufDissle" &&
                        player.cards.filter((card) => card.value == "7").length === 5
                    ) {
                        let winnerIndex = currentGame.players.findIndex(
                            (element) => element.socket.id === player.socket.id
                        );
                        endGame(currentGame, winnerIndex);
                    }
                    if (player.melden === true) {
                        let types = ["Eichel", "Blatt", "Herz", "Schellen"];
                        let playableCards = [];
                        let cardFound = false;
                        types.forEach(function (type) {
                            let sameType = player.cards.filter((card) => card.type == type);
                            if (
                                sameType.length > 1 &&
                                sameType.filter((card) => card.value == "O").length > 0 &&
                                sameType.filter((card) => card.value == "K").length > 0
                            ) {
                                playableCards.push(sameType.filter((card) => card.value == "O"));
                                playableCards.push(sameType.filter((card) => card.value == "K"));
                            }
                        });
                        playableCards.forEach(function (card) {
                            if (card[0].type === data.type && card[0].value === data.value) {
                                cardFound = true;
                            }
                        });

                        if (cardFound === true) {
                            if (currentGame.players.length === currentGame.order.length)
                                currentGame.playedCards = [];
                            acceptPlayedCard(socket, player, currentGame, data);

                            io.in(currentGame.lobbycode).emit("setInfoType", {
                                type: "hatGemeldet",
                                detail: player.username,
                            });

                            player.score += 20;
                            if (player.playedCard.type === currentGame.trumpCard.type) {
                                player.score += 20;
                            }

                            if (player.score >= 101) {
                                let winnerIndex = currentGame.players.findIndex(
                                    (element) => element.socket.id === player.socket.id
                                );
                                endGame(currentGame, winnerIndex);
                            }

                            player.socket.emit("setScore", player.score);
                        } else {
                            declinePlayedCard(socket, player, currentGame, data);
                        }
                    } else {
                        if (currentGame.players.length === currentGame.order.length)
                            currentGame.playedCards = [];
                        acceptPlayedCard(socket, player, currentGame, data);
                    }

                    if (currentGame.order.length === 0) {
                        // If currrent round is over
                        let winnerIndex = decideWinner(currentGame);
                        endRound(currentGame, winnerIndex);
                    }
                    break;
            }
        } else {
            declinePlayedCard(socket, player, currentGame, data);
            socket.emit("setWarningType", { type: "notYourTurn", detail: "" });
        }
    });

    // This function holds the logic for choosing an opening
    socket.on("chooseOpening", (data) => {
        let player = players.find((element) => element.socket == socket);
        let currentGame = games.find((element) => element.lobbycode === player.lobbycode);

        currentGame.opening = data;
        console.log(data);
        io.to(socket.id).emit("closeOpening", "");
        io.to(currentGame.lobbycode).emit("setOpening", data);
        // Set GameOpening
    });

    socket.on("Melden", (data) => {
        let player = players.find((element) => element.socket === socket);
        player.melden = data;
        console.log("Melden:" + data);
    });

    // This function contains the logic for when a player disconnects
    socket.on("disconnect", () => {
        console.log(`${players.length} | Client disconnected (${socket.id})`);
        shutGame(socket);
        resetPlayer(socket);
        players = players.filter((player) => player.socket.id !== socket.id);
    });

    socket.on("template", () => {
        // Do something
    });
});

// Function that determines the winner of a "Stich"
function decideWinner(currentGame) {
    let playerWithHighestPoints = currentGame.players[0];
    let playerWithHighestPointsHasTrump =
        playerWithHighestPoints.playedCard.type === currentGame.trumpCard.type;
    currentGame.players.forEach(function (player) {
        let playerHasTrump = player.playedCard.type === currentGame.trumpCard.type;
        let playerHasHigherCard =
            pointsMap.get(player.playedCard.value) >
            pointsMap.get(playerWithHighestPoints.playedCard.value);
        if (
            (playerHasTrump && !playerWithHighestPointsHasTrump) ||
            (((playerHasTrump && playerWithHighestPointsHasTrump) ||
                (!playerHasTrump && !playerWithHighestPointsHasTrump)) &&
                playerHasHigherCard)
        ) {
            playerWithHighestPoints = player;
        }
    });

    let winnerIndex = currentGame.players.findIndex((player) => player === playerWithHighestPoints);
    return winnerIndex;
}

// Function for ending a game in case somebody won
function endGame(currentGame, winnerIndex) {
    let winnerName = currentGame.players[winnerIndex].username;
    io.in(currentGame.lobbycode).emit("setInfoType", {
        type: "somebodyWonTheGame",
        detail: winnerName,
    });

    setTimeout(() => {
        resetGame(currentGame);
    }, 10000);
}

// Function for closing a game in case a player disconnects
function shutGame(socket) {
    let disconnectedPlayer = players.find((element) => element.socket == socket);
    if (disconnectedPlayer.lobbycode === "") return;
    let currentGame = games.find((element) => element.lobbycode === disconnectedPlayer.lobbycode);

    // Tell other players that the game will be closed
    io.in(disconnectedPlayer.lobbycode).emit("setInfoType", {
        type: "playerLeft",
        detail: disconnectedPlayer.username,
    });

    currentGame.players.forEach((player) => {
        // Unready all players
        player.ready = false;
    });

    setTimeout(() => {
        resetGame(currentGame);
    }, 15000);
}

// Function for resetting all variables when a game returns back to the lobby
function resetGame(currentGame) {
    io.in(currentGame.lobbycode).emit("setGameStarted", false);

    // Reset game
    currentGame.ongoing = false;
    currentGame.trumpCard = {};
    currentGame.opening = "";
    currentGame.talon = [];
    currentGame.playedCards = [];

    currentGame.players.forEach((player) => {
        // Reset player information
        player.ready = false;
        player.score = 0;
        player.vorhand = false;
        player.playedCard = {};
        player.cards = [];
        player.melden = false;
    });

    shareLobbyInformation(currentGame.lobbycode);
}

// Function that is called everytime a game could be started
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
    if (![1, 2, 3, 4, 6].includes(amountPlayers)) {
        io.in(lobbycode).emit("setWarningType", { type: "falsePlayercount", detail: "" });
        return;
    }
    if (currentGame.ongoing) return;

    // START A GAME

    currentGame.ongoing = true;

    currentGame.order = currentGame.players.slice();
    let orderUsernames = currentGame.order.map((player) => player.username);
    io.in(lobbycode).emit("setOrder", orderUsernames);
    io.in(currentGame.lobbycode).emit("setPlayerWithTurn", currentGame.order[0].username);

    currentGame.players[0].vorhand = true;

    currentGame.talon = createTalon();
    io.in(lobbycode).emit("setTalon", currentGame.talon);

    currentGame.trumpCard = chooseTrumpCard(lobbycode);
    io.in(lobbycode).emit("setTrumpCard", currentGame.trumpCard);

    currentGame.players.forEach((player) => {
        drawCard(lobbycode, 5, player);
        io.to(player.socket.id).emit("setYourCards", player.cards);
        checkCanCall(player);
    });

    io.in(lobbycode).emit("setTalon", currentGame.talon);

    io.to(currentGame.players[0].socket.id).emit("openOpening", "");

    io.in(lobbycode).emit("setGameStarted", true);
    console.log(`Started a game for lobbycode ${lobbycode}`);
}

// Function for sharing lobbycode, amount of ready players and information about the players between all players
function shareLobbyInformation(lobbycode) {
    if (lobbycode === "") return;
    let currentGame = games.find((element) => element.lobbycode === lobbycode);
    if (!currentGame) return;

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

// Function for completely resetting a player when disconnecting or leaving a lobby
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
    currentPlayer.ready = false;
    currentPlayer.wins = 0;
    currentPlayer.score = 0;
    currentPlayer.vorhand = false;
    currentPlayer.playedCard = {};
    currentPlayer.cards = [];
    currentPlayer.melden = false;
}

// Function for calculating the score of a Stich
function calculateScore(cards) {
    let points = 0;
    cards.forEach(function (card) {
        points += pointsMap.get(card.value);
    });
    return points;
}

// Function that is called everytime a played card is declined
function declinePlayedCard(socket, player, currentGame) {
    io.in(currentGame.lobbycode).emit("setPlayedCards", currentGame.playedCards);
    socket.emit("setYourCards", player.cards);
}

// Function that is called everytime a played card is accepted
function acceptPlayedCard(socket, player, currentGame, data) {
    player.playedCard = data;
    let cardIndex = player.cards.findIndex(
        (element) => element.type === data.type && element.value === data.value
    );

    player.cards.splice(cardIndex, 1);
    socket.emit("setYourCards", player.cards);

    currentGame.playedCards.push(data);
    io.in(currentGame.lobbycode).emit("setPlayedCards", currentGame.playedCards);

    currentGame.order.shift();
    if (currentGame.order.length > 0)
        io.in(currentGame.lobbycode).emit("setPlayerWithTurn", currentGame.order[0].username);
}

// Function that is called at the end of every round
function endRound(currentGame, winnerIndex) {
    if (currentGame.players[winnerIndex].vorhand === true && currentGame.opening === "AufDissle") {
        // Player lost
    }

    // Send scores to every player
    currentGame.players[winnerIndex].score += calculateScore(currentGame.playedCards);
    currentGame.players.forEach((player) => {
        player.socket.emit("setScore", player.score);
    });

    if (currentGame.players[winnerIndex].score >= 20) {
        endGame(currentGame, winnerIndex);
        return;
    }

    if (currentGame.opening !== "AufDissle") {
        currentGame.opening = "";
        io.in(currentGame.lobbycode).emit("setOpening", "");
    }

    console.log(currentGame.players[winnerIndex].username + " won");
    io.in(currentGame.lobbycode).emit("setInfoType", {
        type: "somebodyWonTheStich",
        detail: currentGame.players[winnerIndex].username,
    });

    // Create new-order
    let winner = currentGame.players[winnerIndex];
    while (winner != currentGame.players[0]) {
        currentGame.players.push(currentGame.players.shift());
    }
    currentGame.order = currentGame.players.slice();
    let orderUsernames = currentGame.order.map((player) => player.username);
    io.in(currentGame.lobbycode).emit("setOrder", orderUsernames);
    io.in(currentGame.lobbycode).emit("setPlayerWithTurn", currentGame.order[0].username);

    setTimeout(() => {
        currentGame.players.forEach((player) => {
            drawCard(currentGame.lobbycode, 1, player);
            io.to(player.socket.id).emit("setYourCards", player.cards);
            checkCanCall(player);
        });
        io.in(currentGame.lobbycode).emit("setTalon", currentGame.talon);

        io.in(currentGame.lobbycode).emit("setInfoType", { type: "newCards", detail: "" });
    }, 1000);
}

// Function that checks if a player can use the utility "Melden"
function checkCanCall(player) {
    let types = ["Eichel", "Blatt", "Herz", "Schellen"];
    let sendTrue = false;
    types.forEach(function (type) {
        let sameType = player.cards.filter((card) => card.type == type);
        if (
            sameType.length > 1 &&
            sameType.filter((card) => card.value == "O").length > 0 &&
            sameType.filter((card) => card.value == "K").length > 0
        ) {
            io.to(player.socket.id).emit("canCall", true);
            sendTrue = true;
        }
    });
    if (sendTrue === false) {
        io.to(player.socket.id).emit("canCall", false);
    }
}

// Function that holds the game logic for the opening "Andere Alte hat"
function processAndereAlteHat(socket, data, player, currentGame) {
    if (player === currentGame.players[0] && data.value !== "A") {
        // If vorhand plays not allowed card
        declinePlayedCard(socket, player, currentGame);
        socket.emit("setWarningType", { type: "noAceButAceOpening", detail: "" });
    } else {
        // If allowed card is played
        acceptPlayedCard(socket, player, currentGame, data);
    }

    if (currentGame.order.length === 0) {
        // If currrent round is over
        let winnerIndex = 0;
        if (
            currentGame.playedCards.filter(
                (card) => card.value === "A" && card.type === currentGame.playedCards[0].type
            ).length !== 1
        ) {
            // If somebody else played the same ace
            winnerIndex = currentGame.players
                .slice(1)
                .findIndex(
                    (player) =>
                        player.playedCard.type == currentGame.playedCards[0].type &&
                        player.playedCard.value == currentGame.playedCards[0].value
                );
        }
        endRound(currentGame, winnerIndex);
    }
}

// Function that holds the game logic for the opening "Ge-Elfen"
function processGeElfen(socket, data, player, currentGame) {
    if (player === currentGame.players[0] && data.value !== "A") {
        declinePlayedCard(socket, player, currentGame);
        socket.emit("setWarningType", { type: "noAceButAceOpening", detail: "" });
    } else {
        acceptPlayedCard(socket, player, currentGame, data);
    }
    if (currentGame.order.length === 0) {
        endRound(currentGame, 0);
    }
}

// Function that holds the game logic for the opening "Höher hat"
function processHöherHat(socket, data, player, currentGame) {
    if (
        player === currentGame.players[0] &&
        (data.value === "A" || data.type === currentGame.trumpCard.type)
    ) {
        declinePlayedCard(socket, player, currentGame);
        socket.emit("setWarningType", { type: "aceOrTrumpInHöherHat", detail: "" });
    } else {
        acceptPlayedCard(socket, player, currentGame, data);
    }

    if (currentGame.order.length === 0) {
        let winnerIndex = 0;
        let beginnerPlayer = currentGame.players.find((player) => player.vorhand == true);
        let notBeginnerPlayers = currentGame.players.filter((player) => player.vorhand == false);
        let playerWithHighestPoints = beginnerPlayer;

        notBeginnerPlayers.forEach((player) => {
            if (
                player.playedCard.type === beginnerPlayer.playedCard.type &&
                pointsMap.get(player.playedCard.value) >
                    pointsMap.get(playerWithHighestPoints.playedCard.value)
            ) {
                playerWithHighestPoints = player;
            }
        });
        if (playerWithHighestPoints != beginnerPlayer) {
            winnerIndex = currentGame.players.findIndex(
                (player) => player === playerWithHighestPoints
            );
        }
        endRound(currentGame, winnerIndex);
        currentGame.opening = "";
    }
}

// Function that creates the Talon from scratch
function createTalon() {
    // let types = ["Eichel", "Blatt", "Herz", "Schellen"];
    let types = ["Eichel", "Blatt"];
    // let types = ["Eichel"];
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

// Function that chooses the trump card for the next game
function chooseTrumpCard(lobbycode) {
    let currentGame = games.find((element) => element.lobbycode === lobbycode);

    let newTrumpCard = currentGame.talon[currentGame.talon.length - 1];
    currentGame.talon.slice(0, currentGame.talon.length - 1);

    return newTrumpCard;
}

// Function for drawing a card, sorting the new cards and sending them to the corresponding player
function drawCard(lobbycode, amount, player) {
    let currentGame = games.find((element) => element.lobbycode === lobbycode);

    if (player.cards.length < 5 && currentGame.talon.length > 0) {
        // Gets last cards of the talon array and removes them
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
