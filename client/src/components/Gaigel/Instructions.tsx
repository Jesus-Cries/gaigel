import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Box, Typography, Card, Button, IconButton } from "@material-ui/core";

import InstructionPage1 from "./InstructionPages/InstructionPage1";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            zIndex: 60,
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
            fontWeight: "lighter",
        },
    })
);

interface Props {}

const Instructions: React.FC<Props> = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Card className={classes.root}>
            <Typography align="center" variant={matches ? "h4" : "h5"} className={classes.header}>
                Anleitung
            </Typography>
            <InstructionPage1 />
        </Card>
    );
};

export default Instructions;
