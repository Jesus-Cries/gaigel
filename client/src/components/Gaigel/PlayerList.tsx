import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: "250px",
            maxWidth: "500px",
            borderRadius: 20,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            gap: "5px",
        },
        nameContainer: {
            zIndex: 10,
            padding: 4,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderRadius: 4,
        },
        name: {
            zIndex: 10,
            padding: 5,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 4,
            fontWeight: "lighter",
        },
        winAnimation: {
            "&::before": {
                content: "''",
                position: "absolute",
                width: "65%",
                height: "40%",
                background: "radial-gradient(#ffffff,#ff9100)",
                animation: `$pulsate 1000ms ${theme.transitions.easing.easeInOut} alternate forwards 5`,
                borderRadius: "4px",
            },
            "&::after": {
                content: "''",
                position: "absolute",
                background: "white",
                inset: "4px",
                borderRadius: "4px",
            },
        },
        "@keyframes pulsate": {
            "0%": {
                width: "65%",
                height: "40%",
            },
            "100%": {
                width: "100%",
                height: "100%",
            },
        },
    })
);
interface PlayerProps {
    username: string;
    socketId: string;
}
interface Props {
    order: PlayerProps[];
    playerWithTurn: PlayerProps;
    highlightedPlayer: PlayerProps;
}

const PlayerList: React.FC<Props> = ({ order, playerWithTurn, highlightedPlayer }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box className={classes.root}>
            {order.map((player, index) => {
                let turn = player.socketId === playerWithTurn.socketId;
                let highlighted = player.socketId === highlightedPlayer.socketId;
                return (
                    <Box
                        className={
                            highlighted
                                ? `${classes.nameContainer} ${classes.winAnimation}`
                                : `${classes.nameContainer}`
                        }
                    >
                        <Typography
                            variant={matches ? "body1" : "body2"}
                            className={classes.name}
                            style={{ border: turn ? "2px solid #ffe600" : "none" }}
                            key={index}
                        >
                            {index + 1}. {player.username}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default PlayerList;
