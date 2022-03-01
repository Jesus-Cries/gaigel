// MARK: Imports
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import LandingPage from "./LandingPage";
import Talon from "./Talon";
import TrumpCard from "./TrumpCard";
import PlayedCards from "./PlayedCards";
import YourCards from "./YourCards";
import { Box } from "@material-ui/core";
import Opening from "./Opening";
import LobbyPage from "./LobbyPage";
import PlayerList from "./PlayerList";
import GameInformation from "./GameInformation";
import Popup from "./Popup";
import EndPopup from "./EndPopup";
import Header from "./Header";
import Actions from "./Actions";
import OpeningInstructions from "./OpeningInstructions";
import Instructions from "./Instructions";

// MARK: Styles
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            height: "100vh",
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignContent: "space-around",
            alignItems: "center",
        },
        openingInstructions: {},
        talonAndTrump: {
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignContent: "center",
            alignItems: "center",
        },
    })
);

interface Props {}

interface CardProps {
    type: string;
    value: string;
}

interface PlayerProps {
    username: string;
    socketId: string;
}

interface LobbyInformation {
    lobbycode: string;
    amountReadyPlayers: number;
    playerInformation: [
        {
            username: string;
            wins: number;
        }
    ];
}

interface WarningInfoProps {
    type: string;
    detail: string;
}

interface EndPlayerInformation {
    username: string;
    score: number;
    wins: number;
}

const Gaigel: React.FC<Props> = () => {
    // MARK: States
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    // Boolean for deciding on whether to show the landing page or the lobby
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    // Boolean for deciding on whether to show the lobby page or the game
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    const [showInstructions, setShowInstructions] = useState<boolean>(false);

    const [ownUsername, setOwnUsername] = useState<string>("");
    const [ownSocketId, setOwnSocketId] = useState<string>("");

    const [score, setScore] = useState<number>(0);

    // All needed information about the joined lobby
    const [lobbyInformation, setLobbyInformation] = useState<LobbyInformation>({
        lobbycode: "",
        amountReadyPlayers: 0,
        playerInformation: [{ username: "", wins: 0 }],
    });

    const [order, setOrder] = useState<PlayerProps[]>([]);
    const [playerWithTurn, setPlayerWithTurn] = useState<PlayerProps>({
        username: "",
        socketId: "",
    });

    const [opening, setOpening] = useState<boolean>(false);

    const [currentOpening, setCurrentOpening] = useState<string>("");

    const [socket, setSocket] = useState(null);

    // Determines if the player can call (Melden)
    const [canCall, setCanCall] = useState<boolean>(false);

    const [announcing, setAnnouncing] = useState<boolean>(false);

    // Determines if the player can steal (Rauben)
    const [canSteal, setCanSteal] = useState<boolean>(false);

    const [showEndPopup, setShowEndPopup] = useState<boolean>(false);

    const [endInformation, setEndInformation] = useState<EndPlayerInformation[]>([
        { username: "", score: 0, wins: 0 },
    ]);

    // The cards that can still be drawn from the talon
    const [talonCards, setTalonCards] = useState<CardProps[]>(
        new Array(0).fill({ type: "", value: "" })
    );

    // The trump card
    const [trumpCard, setTrumpCard] = useState<CardProps>({ type: "", value: "" });

    // The cards that are currently being played
    const [playedCards, setPlayedCards] = useState<CardProps[]>([]);

    // The cards that the user currently has
    const [yourCards, setYourCards] = useState<CardProps[]>(
        new Array(5).fill({ type: "", value: "" })
    );

    const [warningType, setWarningType] = useState<WarningInfoProps>({ type: "", detail: "" });
    const [infoType, setInfoType] = useState<WarningInfoProps>({ type: "", detail: "" });

    const [clickedOpening, setClickedOpening] = useState<boolean>(false);

    const [lostAufDissle, setLostAufDissle] = useState<boolean>(false);

    const [losingPlayer, setLosingPlayer] = useState<string>("");

    const toggleShowInstructions = () => {
        let newValue: boolean = !showInstructions;
        setShowInstructions(newValue);
    };

    const onClickOpening = () => {
        setClickedOpening(!clickedOpening);
    };

    const resetWarning = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setWarningType({ type: "", detail: "" });
    };

    const resetInfo = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setInfoType({ type: "", detail: "" });
    };

    const login = (username: string, lobbycode: string) => {
        setOwnUsername(username);

        // @ts-ignore
        socket.emit("joinLobby", { username: username, lobbycode: lobbycode });
    };

    const backToLogin = () => {
        setLoggedIn(false);
        setGameStarted(false);

        // @ts-ignore
        socket.emit("backToLogin", "");
    };

    const backToLobby = () => {
        setGameStarted(false);
        // @ts-ignore
        socket.emit("backToLobby", "");
    };

    const getReady = () => {
        // @ts-ignore
        socket.emit("getReady", "");
    };

    const drawCard = () => {
        console.log("Want to draw card");
    };

    // MARK: playCard
    const playCard = (type: string, value: string) => {
        if (opening) {
            setWarningType({ type: "noOpeningChosen", detail: "" });
            return;
        }

        if (yourCards.length < 5 && talonCards.length > 0) {
            setWarningType({ type: "waitForCards", detail: "" });
            return;
        }

        let playedCard: CardProps = { type: type, value: value };
        // @ts-ignore
        socket.emit("playCard", playedCard);
    };

    const AndereAlteHat = () => {
        if (yourCards.filter((card) => card.value === "A").length > 0) {
            // @ts-ignore
            socket.emit("chooseOpening", "AndereAlteHat");
        } else {
            setWarningType({ type: "noAce", detail: "" });
        }
    };

    const GeElfen = () => {
        if (yourCards.filter((card) => card.value === "A").length > 0) {
            // @ts-ignore
            socket.emit("chooseOpening", "GeElfen");
        } else {
            setWarningType({ type: "noAce", detail: "" });
        }
    };

    const HöherHat = () => {
        let allowedCards = yourCards.filter(
            (card) => trumpCard.type !== card.type && card.value !== "A"
        );

        if (allowedCards.length < 1) {
            setWarningType({ type: "höherHatNotPossible", detail: "" });
        } else {
            // @ts-ignore
            socket.emit("chooseOpening", "HöherHat");
        }
    };

    const AufDissle = () => {
        // @ts-ignore
        socket.emit("chooseOpening", "AufDissle");
    };

    const melden = () => {
        if (ownUsername === playerWithTurn.username) {
            // @ts-ignore
            socket.emit("Melden", !announcing);
            setAnnouncing(!announcing);
        } else {
            setWarningType({ type: "meldenNotCurrentlyPlaying", detail: "" });
        }
    };

    const rauben = () => {
        // @ts-ignore
        socket.emit("Rauben");
    };

    // MARK: useEffect
    useEffect(() => {
        console.log("UseEffect 1 was called");
        // @ts-ignore
        setSocket(socket);
    }, []);

    // @ts-ignore
    useEffect(() => {
        let domain = "https://gaigel-web.herokuapp.com/";
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            domain = "http://127.0.0.1:5000";
        }

        const newSocket = socketIOClient(domain);

        // @ts-ignore
        setSocket(newSocket);

        newSocket.on("onConnect", (data: string) => {
            setOwnSocketId(data);
            console.log("Here");
        });

        newSocket.on("setLoggedIn", (data: boolean) => {
            setLoggedIn(data);
        });

        newSocket.on("lobbyInformation", (data: LobbyInformation) => {
            setLobbyInformation(data);
        });

        newSocket.on("setOrder", (data: PlayerProps[]) => {
            setOrder(data);
        });

        newSocket.on("setPlayerWithTurn", (data: PlayerProps) => {
            setPlayerWithTurn(data);
        });

        newSocket.on("setInfoType", (data: WarningInfoProps) => {
            setInfoType(data);
        });

        newSocket.on("setWarningType", (data: WarningInfoProps) => {
            setWarningType(data);
        });

        newSocket.on("setScore", (data: number) => {
            setScore(data);
        });

        newSocket.on("setGameStarted", (data: boolean) => {
            setGameStarted(data);
            console.log("Game state: " + data);
        });

        newSocket.on("setTalon", (data: CardProps[]) => {
            setTalonCards(data);
        });

        newSocket.on("setTrumpCard", (data: CardProps) => {
            setTrumpCard(data);
        });

        newSocket.on("setYourCards", (data: CardProps[]) => {
            setYourCards(data);
        });

        newSocket.on("setPlayedCards", (data: CardProps[]) => {
            setPlayedCards(data);
        });

        newSocket.on("setOpening", (data: boolean) => {
            setOpening(data);
        });

        newSocket.on("setCurrentOpening", (data: string) => {
            setCurrentOpening(data);
        });

        newSocket.on("canCall", (data: boolean) => {
            setCanCall(data);
        });

        newSocket.on("canSteal", (data: boolean) => {
            setCanSteal(data);
        });

        newSocket.on("setShowEndPopup", (data: boolean) => {
            setShowEndPopup(data);
        });

        newSocket.on("setEndInformation", (data: EndPlayerInformation[]) => {
            setEndInformation(data);
        });

        newSocket.on("lostAufDissle", (data: string) => {
            setLostAufDissle(true);
            setLosingPlayer(data);
        });

        return () => newSocket.close();
    }, [setSocket]);

    // MARK: Return
    // @ts-ignore
    return (
        <Box
            className={classes.root}
            style={
                loggedIn && gameStarted
                    ? { backgroundColor: "#fff", boxShadow: "5px 5px 15px black" }
                    : {}
            }
        >
            {!loggedIn ? (
                <LandingPage login={login} toggleShowInstructions={toggleShowInstructions} />
            ) : !gameStarted ? (
                <LobbyPage
                    backToLogin={backToLogin}
                    lobbycode={lobbyInformation.lobbycode}
                    playerInformation={lobbyInformation.playerInformation}
                    amountReadyPlayers={lobbyInformation.amountReadyPlayers}
                    getReady={getReady}
                    toggleShowInstructions={toggleShowInstructions}
                />
            ) : (
                <>
                    <Header />
                    <GameInformation
                        username={ownUsername}
                        lobbycode={lobbyInformation.lobbycode}
                        score={score}
                    />
                    <PlayerList order={order} playerWithTurn={playerWithTurn} />
                    <hr style={{ width: "100%" }} />
                    <Box className={classes.talonAndTrump}>
                        <Talon cardsLeft={talonCards.length} drawCard={drawCard} />
                        <TrumpCard trumpCard={trumpCard} />
                    </Box>

                    <PlayedCards
                        playedCards={playedCards}
                        playerCount={lobbyInformation.playerInformation.length}
                        opening={currentOpening}
                    />

                    <hr style={{ width: "100%" }} />

                    {clickedOpening && (
                        <OpeningInstructions setClickedOpening={setClickedOpening} />
                    )}

                    {showEndPopup && (
                        <EndPopup
                            aufDissle={lostAufDissle}
                            endInformation={endInformation}
                            backToLobby={backToLobby}
                            losingPlayer={losingPlayer}
                        />
                    )}

                    {(canCall || canSteal) && (
                        <Actions
                            canCall={canCall}
                            announcing={announcing}
                            melden={melden}
                            canSteal={canSteal}
                            rauben={rauben}
                        />
                    )}

                    {opening && (
                        <Opening
                            AndereAlteHat={AndereAlteHat}
                            GeElfen={GeElfen}
                            HöherHat={HöherHat}
                            AufDissle={AufDissle}
                            handleClick={onClickOpening}
                            hover={clickedOpening}
                        />
                    )}

                    <YourCards
                        userCards={yourCards}
                        playCard={playCard}
                        ownSocketId={ownSocketId}
                        playerWithTurnSocketId={playerWithTurn.socketId}
                        toggleShowInstructions={toggleShowInstructions}
                    />
                </>
            )}
            <Popup
                snackbarType="info"
                type={infoType.type}
                detail={infoType.detail}
                reset={resetInfo}
            />
            <Popup
                snackbarType="warning"
                type={warningType.type}
                detail={warningType.detail}
                reset={resetWarning}
            />
            {showInstructions && <Instructions toggleShowInstructions={toggleShowInstructions} />}
        </Box>
    );
};

export default Gaigel;
