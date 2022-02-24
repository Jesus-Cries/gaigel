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
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "5px",
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
    toggleShowInstructions: () => void;
}

const YourCards: React.FC<Props> = ({ userCards, playCard, toggleShowInstructions }) => {
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

                <Box className={classes.cardContainer}>
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
