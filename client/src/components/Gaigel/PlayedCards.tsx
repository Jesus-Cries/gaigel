import { useEffect, useState } from "react";
import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Grid, Box, Typography } from "@material-ui/core";

import GaigelCard from "./GaigelCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
        },
        header: {
            fontWeight: "lighter",
        },
    })
);

interface CardProps {
    type: string;
    value: string;
}

interface Props {
    playedCards: CardProps[];
    playerCount: number;
    opening: string;
    highlightedCardIndex: number;
}

const PlayedCards: React.FC<Props> = ({
    playedCards,
    playerCount,
    opening,
    highlightedCardIndex,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("lg"));

    let i: number = -1;
    let hidden: boolean = opening === "AndereAlteHat" || opening === "HöherHat";

    const [cards, setCards] = useState<CardProps[]>(
        new Array(playerCount).fill({ type: "", value: "" })
    );

    useEffect(() => {
        let tempCards: CardProps[] = playedCards.slice();
        for (let i = playedCards.length; i < playerCount; i++) {
            tempCards.push({ type: "", value: "" });
        }
        setCards(tempCards);
    }, [playedCards, playerCount]);

    return (
        <Box className={classes.root}>
            <Typography variant={matches ? "h6" : "body1"} className={classes.header}>
                Gespielte Karten
            </Typography>

            <Grid container spacing={1} justifyContent="center">
                {cards.map((card) => {
                    i++;
                    let highlighted = i === highlightedCardIndex;
                    return (
                        <Grid item key={i}>
                            <GaigelCard
                                type={card.type}
                                value={card.value}
                                clickable={false}
                                hidden={hidden}
                                highlighted={highlighted}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default PlayedCards;
