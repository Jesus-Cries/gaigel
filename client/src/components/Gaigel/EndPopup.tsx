import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Typography, Card, Button, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useEffect, useState } from "react";

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            zIndex: 50,
            maxWidth: "450px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            boxShadow: "5px 5px 15px black",
        },
        header: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "5px",
        },
        logo: {
            width: "50px",
            [theme.breakpoints.up("md")]: {
                width: "70px",
            },
        },
        rankingHeaderContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
        },
        rankingHeader: {
            textAlign: "center",
            fontWeight: "lighter",
        },
        rankingContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "5px",
        },
        rankingElement: {
            display: "flex",
            justifyContent: "space-between",
        },
        rankingElementText: {
            fontWeight: "lighter",
        },
        footer: {
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            gap: "30px",
        },
    })
);

interface EndPlayerInformation {
    username: string;
    score: number;
    wins: number;
}

interface Props {
    endInformation: EndPlayerInformation[];
    backToLobby: () => void;
    aufDissle: boolean;
    losingPlayer?: string;
}

const EndPopup: React.FC<Props> = ({ endInformation, backToLobby, aufDissle, losingPlayer }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const [showRanking, setShowRanking] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(20);
    const [finalSorting, setFinalSorting] = useState<EndPlayerInformation[]>([
        { username: "", score: 0, wins: 0 },
    ]);

    let sortedByScore: EndPlayerInformation[] = endInformation.slice().sort((player1, player2) => {
        if (player1.score < player2.score) return 1;
        if (player1.score > player2.score) return -1;
        return 0;
    });

    let sortedByWins: EndPlayerInformation[] = endInformation.slice().sort((player1, player2) => {
        if (player1.wins < player2.wins) return 1;
        if (player1.wins > player2.wins) return -1;
        return 0;
    });

    const toggleShowRanking = () => {
        let newToggle: boolean = !showRanking;
        setShowRanking(newToggle);
    };

    const decreaseCounter = (newCounter: number) => {
        setCounter(newCounter);

        if (newCounter > 0) {
            setTimeout(() => {
                decreaseCounter(newCounter - 1);
            }, 1000);
        }
    };

    useEffect(() => {
        if (showRanking) setFinalSorting(sortedByWins);
        else setFinalSorting(sortedByScore);
    }, [showRanking, sortedByScore, sortedByWins]);

    useEffect(() => {
        setCounter(20);
        decreaseCounter(20);
    }, [endInformation]);

    return (
        <Card className={classes.root}>
            <Box className={classes.header}>
                <img src={"/crown.png"} className={classes.logo} alt="" />
                <Typography align="center" variant={matches ? "h4" : "h5"}>
                    {aufDissle
                        ? `${losingPlayer} hat auf Dissle verloren!`
                        : `${endInformation[0].username} hat gewonnen!`}
                </Typography>
            </Box>

            <hr />

            <Box className={classes.rankingHeaderContainer}>
                <IconButton onClick={toggleShowRanking}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography className={classes.rankingHeader} variant={matches ? "h5" : "h6"}>
                    {showRanking ? "Ranking" : "Platzierungen"}
                </Typography>
                <IconButton onClick={toggleShowRanking}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <Box className={classes.rankingContainer}>
                {finalSorting.map((player, index) => (
                    <Box className={classes.rankingElement}>
                        <Typography
                            variant={matches ? "h6" : "body1"}
                            className={classes.rankingElementText}
                        >
                            {index + 1}. {player.username}
                        </Typography>
                        <Typography
                            variant={matches ? "h6" : "body1"}
                            className={classes.rankingElementText}
                        >
                            {showRanking ? player.wins : Math.floor(player.score)}{" "}
                            {showRanking
                                ? player.wins === 1
                                    ? "Sieg"
                                    : "Siege"
                                : player.score === 1
                                ? "Punkt"
                                : "Punkte"}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box className={classes.footer}>
                <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={backToLobby}>
                    Lobby
                </Button>
                <Typography align="right" noWrap={true}>
                    Nächste Runde in <b>{counter}</b>
                </Typography>
            </Box>
        </Card>
    );
};

export default EndPopup;
