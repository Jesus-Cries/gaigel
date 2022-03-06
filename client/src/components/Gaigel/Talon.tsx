import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Grid, Paper, CardActionArea, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
        },
        cardActionArea: {
            height: "100%",
            width: "100%",
            display: "flex",
        },
        paper: {
            width: 40,
            height: 60,
            [theme.breakpoints.up("md")]: {
                width: 50,
                height: 75,
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
        },
        counter: {
            fontWeight: "lighter",
        },
        header: {
            fontWeight: "lighter",
        },
    })
);
interface Props {
    cardsLeft: number;
    drawCard: (amount: number) => void;
}

const Talon: React.FC<Props> = ({ cardsLeft, drawCard }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Grid item className={classes.root}>
            <Typography variant={matches ? "h6" : "body1"} className={classes.header}>
                Talon
            </Typography>
            <Paper className={classes.paper}>
                <CardActionArea
                    className={classes.cardActionArea}
                    onClick={() => {
                        drawCard(1);
                    }}
                >
                    <img
                        src={"/cardBacksite_noSpaceAround_n1.png"}
                        width={matches ? "50" : "40"}
                        height={matches ? "75" : "60"}
                        alt=""
                    />
                </CardActionArea>
            </Paper>
            <Typography variant={matches ? "body1" : "subtitle2"} className={classes.counter}>
                Karten: {cardsLeft}
            </Typography>
        </Grid>
    );
};

export default Talon;
