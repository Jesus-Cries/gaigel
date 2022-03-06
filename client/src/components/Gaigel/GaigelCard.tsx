import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper, Box, Typography, CardActionArea } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 4,
            position: "relative",
            zIndex: 10,
            width: 44,
            height: 64,
            [theme.breakpoints.up("md")]: {
                width: 54,
                height: 79,
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "none",
        },
        winAnimation: {
            "&::before": {
                content: "''",
                position: "absolute",
                width: "calc(100% - 15px)",
                height: "calc(100% - 15px)",
                background: "radial-gradient(#ffffff,#ff9100)",
                animation: `$pulsate 1500ms 3`,
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
                width: "calc(100% - 15px)",
                height: "calc(100% - 15px)",
                opacity: 2,
            },
            "100%": {
                width: "calc(100% + 4px)",
                height: "calc(100% + 4px)",
                opacity: 0,
            },
        },

        cardActionArea: {
            zIndex: 20,
            height: "100%",
            width: "100%",
            display: "flex",
            borderRadius: 4,
            boxShadow:
                "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        },
        card: {
            zIndex: 20,
            height: "100%",
            [theme.breakpoints.up("md")]: {
                height: "95%",
            },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignContent: "center",
            alignItems: "center",
        },
        symbolRow: {
            width: "85%",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
        },
    })
);
interface Props {
    type: string;
    value: string;
    clickable: boolean;
    playCard?: (type: string, value: string) => void;
    hidden?: boolean;
    highlighted?: boolean;
    keepHighlighting?: boolean;
}

interface Hash {
    [details: string]: string;
}

const GaigelCard: React.FC<Props> = ({
    type,
    value,
    clickable,
    playCard,
    hidden = false,
    highlighted = false,
    keepHighlighting = true,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const symbolMap: Hash = {};
    const iconSize = matches ? 13 : 10;
    symbolMap["Eichel"] = "/Eichel.png";
    symbolMap["Blatt"] = "/Blatt.png";
    symbolMap["Herz"] = "/Herz.png";
    symbolMap["Schellen"] = "/Bollen.png";

    return (
        <Paper
            className={highlighted ? `${classes.root} ${classes.winAnimation}` : `${classes.root}`}
            onClick={() => {
                if (clickable && typeof playCard !== "undefined") playCard(type, value);
            }}
        >
            <CardActionArea
                className={classes.cardActionArea}
                style={{
                    pointerEvents: clickable ? "auto" : "none",
                    border:
                        keepHighlighting && highlighted ? "1px solid #ff9100" : "1px solid #ddd",
                }}
            >
                {hidden && value !== "" ? (
                    <img
                        src={"/cardBacksite_noSpaceAround_n1.png"}
                        width={matches ? "54" : "44"}
                        height={matches ? "79" : "64"}
                        alt=""
                    />
                ) : (
                    value !== "" && (
                        <Box className={classes.card}>
                            <Box className={classes.symbolRow}>
                                <img
                                    src={symbolMap[type]}
                                    width={iconSize}
                                    height={iconSize}
                                    alt=""
                                />
                                <img
                                    src={symbolMap[type]}
                                    width={iconSize}
                                    height={iconSize}
                                    alt=""
                                />
                            </Box>
                            <Typography
                                variant={matches ? "h6" : "body1"}
                                align="center"
                                style={{ fontWeight: "lighter" }}
                            >
                                {value}
                            </Typography>
                            <Box className={classes.symbolRow}>
                                <img
                                    src={symbolMap[type]}
                                    width={iconSize}
                                    height={iconSize}
                                    alt=""
                                />
                                <img
                                    src={symbolMap[type]}
                                    width={iconSize}
                                    height={iconSize}
                                    alt=""
                                />
                            </Box>
                        </Box>
                    )
                )}
            </CardActionArea>
        </Paper>
    );
};

export default GaigelCard;
