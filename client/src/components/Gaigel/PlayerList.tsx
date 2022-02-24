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
        name: {
            padding: 5,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 8,
            fontWeight: "lighter",
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
}

const PlayerList: React.FC<Props> = ({ order, playerWithTurn }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box className={classes.root}>
            {order.map((player, index) => {
                let turn = player.socketId === playerWithTurn.socketId;
                return (
                    <Typography
                        variant={matches ? "body1" : "body2"}
                        className={classes.name}
                        style={{ border: turn ? "2px solid #ffe600" : "none" }}
                        key={index}
                    >
                        {index + 1}. {player.username}
                    </Typography>
                );
            })}
        </Box>
    );
};

export default PlayerList;
