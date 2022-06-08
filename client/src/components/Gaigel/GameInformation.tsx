import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            gap: "10px",
        },
        element: {
            fontWeight: "lighter",
            width: "50%",
        },
        score: {
            fontWeight: "lighter",
        },
    })
);
interface Props {
    username: string;
    lobbycode: string;
    score: number;
}

const GameInformation: React.FC<Props> = ({ username, lobbycode, score }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("lg"));

    return (
        <Box className={classes.root}>
            <Typography variant={matches ? "h6" : "subtitle2"} className={classes.element}>
                {username}
            </Typography>
            <Typography variant={matches ? "h5" : "h6"} className={classes.score}>
                {Math.floor(score)}
            </Typography>
            <Typography
                variant={matches ? "h6" : "subtitle2"}
                className={classes.element}
                align="right"
            >
                {lobbycode}
            </Typography>
        </Box>
    );
};

export default GameInformation;
