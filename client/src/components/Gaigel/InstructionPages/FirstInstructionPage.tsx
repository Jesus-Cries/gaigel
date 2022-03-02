import { useEffect, useState } from "react";

import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Box, Typography } from "@material-ui/core";

import GaigelCard from "./../GaigelCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
            gap: "20px",
        },
        exampleCard: {
            position: "absolute",
        },
        listContainer: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "5px",
        },
        listItem: {
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignContent: "center",
            alignItems: "center",
        },
        listItemText: {
            width: "40%",
            fontWeight: "normal",
        },
    })
);

interface CardProps {
    type: string;
    value: string;
}

interface CardInfoProps {
    name: string;
    value: number;
}

interface Props {}

const FirstInstructionPage: React.FC<Props> = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const [currentCard, setCurrentCard] = useState<CardProps>({ type: "Eichel", value: "A" });

    const cardValues: string[] = ["A", "10", "K", "O", "U", "7"];
    const cardTypes: string[] = ["Eichel", "Blatt", "Herz", "Schellen"];

    const cardInfo: CardInfoProps[] = [
        {
            name: "Ass",
            value: 11,
        },
        {
            name: "Zehn",
            value: 10,
        },
        {
            name: "König",
            value: 4,
        },
        {
            name: "Ober",
            value: 3,
        },
        {
            name: "Unter",
            value: 2,
        },
        {
            name: "Sieben",
            value: 0,
        },
    ];

    const loopThroughCardValues = () => {
        let valueIndex: number = cardValues.findIndex((value) => value === currentCard.value);
        valueIndex++;
        if (valueIndex >= cardValues.length) valueIndex = 0;

        let randomTypeIndex: number;
        do {
            randomTypeIndex = Math.floor(Math.random() * 4);
        } while (cardTypes[randomTypeIndex] === currentCard.type);

        let newCard: CardProps = {
            type: cardTypes[randomTypeIndex],
            value: cardValues[valueIndex],
        };

        setCurrentCard(newCard);
    };

    useEffect(() => {
        setTimeout(() => {
            loopThroughCardValues();
        }, 1800);
    }, [currentCard]);

    return (
        <Box className={classes.root}>
            <Typography variant={matches ? "h5" : "h6"} style={{ fontWeight: "lighter" }}>
                Grundlegendes
            </Typography>
            <Typography align="justify" variant={matches ? "body1" : "body2"}>
                Gaigel ist ein schwäbisches Kartenspiel, was mit 48 Karten gespielt wird. Die
                Reihenfolge der Karten und die jeweiligen Werte sieht folgendermaßen aus:
            </Typography>

            <Box className={classes.listContainer}>
                <Box className={classes.exampleCard}>
                    <GaigelCard
                        type={currentCard.type}
                        value={currentCard.value}
                        clickable={false}
                    />
                </Box>

                {cardInfo.map((card) => {
                    return (
                        <Box className={classes.listItem}>
                            <Typography
                                variant={matches ? "h6" : "body1"}
                                className={classes.listItemText}
                            >
                                {card.name}
                            </Typography>
                            <Typography
                                variant={matches ? "h6" : "body1"}
                                align="right"
                                className={classes.listItemText}
                            >
                                {card.value} Punkte
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <Typography align="justify" variant={matches ? "body1" : "body2"}>
                Gewonnen hat, wer zuerst eine Punktzahl von mindestens 101 Punkten erreicht, oder,
                wer am Ende, wenn alle Karten ausgespielt wurden, die meisten Punkte gesammelt hat.
                Punkte können gesammelt werden, indem Stiche gewonnen werden. Denn wer einen Stich
                gewinnt, erhält die Summe der Werte aller enthaltenen Karten.
            </Typography>
        </Box>
    );
};

export default FirstInstructionPage;
