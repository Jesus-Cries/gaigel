import { useEffect, useState } from "react";

import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import GaigelCard from "./GaigelCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
        },
        lightFontWeigth: {
            fontWeight: "lighter",
        },
    })
);
interface CardProps {
    type: string;
    value: string;
}

interface Props {
    trumpCard: CardProps;
    openingName: string;
}

const TrumpCard: React.FC<Props> = ({ trumpCard, openingName }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("lg"));

    let emptyChar: string = "⠀";

    return (
        <Grid className={classes.root}>
            <Typography variant={matches ? "h6" : "body1"} className={classes.lightFontWeigth}>
                Trumpf
            </Typography>
            <GaigelCard type={trumpCard.type} value={trumpCard.value} clickable={false} />
            <Typography
                variant={matches ? "body1" : "subtitle2"}
                className={classes.lightFontWeigth}
            >
                {openingName !== "" ? openingName : emptyChar}
            </Typography>
        </Grid>
    );
};

export default TrumpCard;
