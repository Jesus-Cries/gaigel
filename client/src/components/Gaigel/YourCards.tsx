import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Typography } from "@material-ui/core";

import GaigelCard from "./GaigelCard";
import HelpButton from "./HelpButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
        },
        header: {
            fontWeight: "lighter",
        },
        cardContainer: {
            padding: 5,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderRadius: "4px",
        },
        turnAnimation: {
            "&::before": {
                content: "''",
                position: "absolute",
                width: "85%",
                height: "65%",
                background: "radial-gradient(#ffffff,#ff9100)",
                animation: `$pulsate 2000ms ${theme.transitions.easing.easeInOut} infinite`,
                borderRadius: "4px",
            },
            "&::after": {
                content: "''",
                position: "absolute",
                background: "white",
                inset: "5px",
                borderRadius: "4px",
            },
        },
        "@keyframes pulsate": {
            "0%": {
                width: "85%",
                height: "65%",
            },
            "50%": {
                width: "100%",
                height: "100%",
            },
            "100%": {
                width: "85%",
                height: "65%",
            },
        },
        cardsButtonContainer: {
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            gap: "20px",
        },
    })
);

interface CardProps {
    type: string;
    value: string;
}

interface Props {
    userCards: CardProps[];
    playCard: (type: string, value: string) => void;
    ownSocketId: string;
    playerWithTurnSocketId: string;
    toggleShowInstructions: () => void;
}

const YourCards: React.FC<Props> = ({
    userCards,
    playCard,
    ownSocketId,
    playerWithTurnSocketId,
    toggleShowInstructions,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    let filledUserCards: CardProps[] = userCards.slice();

    for (let q = filledUserCards.length; q < 5; q++) {
        filledUserCards.splice(filledUserCards.length, 0, { type: "", value: "" });
    }

    return (
        <Box className={classes.root}>
            <Typography variant={matches ? "h6" : "body1"} className={classes.header}>
                Deine Karten
            </Typography>

            <Box className={classes.cardsButtonContainer}>
                <HelpButton toggleShowInstructions={toggleShowInstructions} invisible={true} />

                <Box
                    className={
                        ownSocketId === playerWithTurnSocketId
                            ? `${classes.cardContainer} ${classes.turnAnimation}`
                            : `${classes.cardContainer}`
                    }
                    style={ownSocketId === playerWithTurnSocketId ? {} : {}}
                >
                    {filledUserCards.map((card, index) => {
                        let currentClickable = card.type === "" ? false : true;
                        return (
                            <GaigelCard
                                type={card.type}
                                value={card.value}
                                clickable={currentClickable}
                                playCard={playCard}
                                key={index}
                            />
                        );
                    })}
                </Box>

                <HelpButton toggleShowInstructions={toggleShowInstructions} />
            </Box>
        </Box>
    );
};

export default YourCards;
