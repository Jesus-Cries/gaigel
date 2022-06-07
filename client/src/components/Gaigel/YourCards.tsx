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
            marginLeft: 40,
            marginRight: 40,
            padding: 7,
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
                width: "calc(100% - 15px)",
                height: "calc(100% - 15px)",
                background: "radial-gradient(#ffffff,#265802)",
                animation: `$pulsate 1500ms infinite`,
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
                width: "calc(100% - 15px)",
                height: "calc(100% - 15px)",
                opacity: 2,
            },
            "100%": {
                width: "calc(100% + 5px)",
                height: "calc(100% + 5px)",
                opacity: 0,
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
    newCard: CardProps;
    showEndPopup: boolean;
}

const YourCards: React.FC<Props> = ({
    userCards,
    playCard,
    ownSocketId,
    playerWithTurnSocketId,
    toggleShowInstructions,
    newCard,
    showEndPopup,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("lg"));

    let filledUserCards: CardProps[] = userCards.slice();

    for (let q = filledUserCards.length; q < 5; q++) {
        filledUserCards.splice(filledUserCards.length, 0, { type: "", value: "" });
    }

    let indexOfNewCard: number = -1;

    filledUserCards.forEach((card, index) => {
        if (
            card.type === newCard.type &&
            card.value === newCard.value &&
            newCard.value !== "" &&
            userCards.length === 5
        ) {
            indexOfNewCard = index;
        }
    });

    return (
        <Box className={classes.root}>
            <Typography variant={matches ? "h6" : "body1"} className={classes.header}>
                Deine Karten
            </Typography>

            <Box className={classes.cardsButtonContainer}>
                <Box
                    className={
                        ownSocketId === playerWithTurnSocketId && !showEndPopup
                            ? `${classes.cardContainer} ${classes.turnAnimation}`
                            : `${classes.cardContainer}`
                    }
                    style={ownSocketId === playerWithTurnSocketId ? {} : {}}
                >
                    {filledUserCards.map((card, index) => {
                        let currentClickable = card.type !== "";
                        let highlightCard = index === indexOfNewCard;

                        return (
                            <GaigelCard
                                type={card.type}
                                value={card.value}
                                clickable={currentClickable}
                                playCard={playCard}
                                key={index}
                                highlighted={highlightCard}
                                keepHighlighting={false}
                            />
                        );
                    })}
                </Box>

                <Box
                    style={{
                        position: "absolute",
                        right: 15,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        zIndex: 500,
                    }}
                >
                    <HelpButton toggleShowInstructions={toggleShowInstructions} />
                </Box>
            </Box>
        </Box>
    );
};

export default YourCards;
