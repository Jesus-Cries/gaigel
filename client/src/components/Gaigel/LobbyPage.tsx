import { useState } from "react";

import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Typography, Button, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Header from "./Header";
import HelpButton from "./HelpButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: "420px",
            padding: 25,
            borderRadius: 10,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
            boxShadow: "5px 5px 15px black",
        },
        control: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        playerList: {
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
            [theme.breakpoints.up("md")]: {
                gap: "15px",
            },
        },
        playerInformation: {
            display: "flex",
            justifyContent: "space-between",
        },
        lighterFontWeight: {
            fontWeight: "lighter",
        },
        controllContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
        },
        readyButton: {
            width: "30%",
        },
    })
);
interface PlayerProps {
    username: string;
    wins: number;
}
interface Props {
    backToLogin: () => void;
    lobbycode: string;
    playerInformation: PlayerProps[];
    amountReadyPlayers: number;
    getReady: () => void;
    toggleShowInstructions: () => void;
}

const LobbyPage: React.FC<Props> = ({
    backToLogin,
    lobbycode,
    playerInformation,
    amountReadyPlayers,
    getReady,
    toggleShowInstructions,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const [ready, setReady] = useState<boolean>(false);

    const handleOnClick = () => {
        getReady();
        setReady(true);
    };

    return (
        <Box className={classes.root}>
            <Header />
            <Box className={classes.control}>
                <IconButton onClick={backToLogin}>
                    <ArrowBackIcon fontSize={matches ? "large" : "medium"} />
                </IconButton>
                <Typography
                    variant={matches ? "h6" : "body1"}
                    className={classes.lighterFontWeight}
                >
                    Lobbycode: {lobbycode}
                </Typography>
            </Box>
            <Box className={classes.playerList}>
                <Typography
                    align="center"
                    variant={matches ? "h5" : "h6"}
                    style={{ fontWeight: "lighter" }}
                >
                    Spielerliste
                </Typography>
                {playerInformation.map((player) => {
                    let winString;
                    if (player.wins === 1) winString = "Sieg";
                    else winString = "Siege";
                    let key = Math.random();
                    return (
                        <Box className={classes.playerInformation} key={key}>
                            <Typography
                                variant={matches ? "h6" : "body1"}
                                className={classes.lighterFontWeight}
                            >
                                {player.username}
                            </Typography>
                            <Typography
                                variant={matches ? "h6" : "body1"}
                                className={classes.lighterFontWeight}
                                style={{ marginLeft: 10 }}
                            >
                                {player.wins} {winString}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <hr style={{ width: "100%" }} />

            <Box className={classes.controllContainer}>
                <Typography
                    variant={matches ? "h6" : "body1"}
                    className={classes.lighterFontWeight}
                >
                    Bereit: {amountReadyPlayers} / {playerInformation.length}
                </Typography>
                <Button
                    className={classes.readyButton}
                    variant="contained"
                    disabled={ready}
                    onClick={handleOnClick}
                    size={matches ? "large" : "small"}
                >
                    Bereit
                </Button>
                <HelpButton toggleShowInstructions={toggleShowInstructions} />
            </Box>
        </Box>
    );
};

export default LobbyPage;
