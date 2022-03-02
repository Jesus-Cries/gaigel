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
            overflow: "hidden",
            borderRadius: "4px",
        },
        announcingAnimation: {
            "&::before": {
                content: "''",
                position: "absolute",
                width: "130%",
                height: "60%",
                background: "linear-gradient(#ffffff,#ff9100, #ffffff)",
                // background: "#00ccee",
                animation: `$rotate 2500ms linear infinite`,
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
