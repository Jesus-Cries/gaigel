import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Button } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            gap: "40px",
        },
        callButton: {
            zIndex: 10,
        },
        callButtonContainer: {
            padding: 4,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
        },
        announcingAnimation: {
            "&::before": {
                content: "''",
                position: "absolute",
                width: "80%",
                height: "55%",
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
                width: "80%",
                height: "55%",
            },
            "100%": {
                width: "100%",
                height: "100%",
            },
        },
    })
);

interface Props {
    canCall: boolean;
    announcing: boolean;
    melden: () => void;
    canSteal: boolean;
    rauben: () => void;
}

const Actions: React.FC<Props> = ({ canCall, announcing, melden, canSteal, rauben }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box className={classes.root}>
            {canCall && (
                <Box
                    className={
                        announcing
                            ? `${classes.callButtonContainer} ${classes.announcingAnimation}`
                            : `${classes.callButtonContainer}`
                    }
                >
                    <Button
                        variant="contained"
                        size={matches ? "medium" : "small"}
                        className={classes.callButton}
                        style={{
                            background: announcing === false ? "#e0e0e0" : "#ffdd1f",
                        }}
                        onClick={melden}
                    >
                        Melden
                    </Button>
                </Box>
            )}

            {canSteal && (
                <Button variant="contained" size={matches ? "medium" : "small"} onClick={rauben}>
                    Rauben
                </Button>
            )}
        </Box>
    );
};

export default Actions;
