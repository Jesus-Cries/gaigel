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
            overflow: "hidden",
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
                width: "50%",
                height: "160%",
                background: "linear-gradient(90deg, #ffffff,#ff9100, #ffffff)",
                // background: "#00ccee",
                animation: `$rotate 3s linear infinite`,
            },
            "&::after": {
                content: "''",
                position: "absolute",
                background: "white",
                inset: "4px",
                borderRadius: "5px",
            },
        },
        "@keyframes rotate": {
            "0%": {
                transform: "rotate(0deg)",
            },
            "100%": {
                transform: "rotate(360deg)",
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
