import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        alert: {
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            [theme.breakpoints.up("md")]: {
                fontSize: "16px",
            },
        },
    })
);

interface Props {
    snackbarType: string;
    type: string;
    detail: string;
    reset: () => void;
}

const Popup: React.FC<Props> = ({ snackbarType, type, detail, reset }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    let message = "";

    switch (type) {
        // -------- Warnings --------
        case "gameOngoing":
            message =
                "Dieser Lobby kann nicht beigetreten werden, da das Spiel bereits im vollen Gange ist.";
            break;
        case "falsePlayercount":
            message =
                "Mit dieser Anzahl an Spielern lässt sich kein Spiel starten. Für ein Spiel werden 2, 3, 4 oder 6 Spieler benötigt.";
            break;
        case "notYourTurn":
            message = "Sie sind nicht an der Reihe und können daher jetzt keine Karte spielen.";
            break;
        case "noOpeningChosen":
            message = "Sie müssen eine Eröffnung auswählen, bevor Sie eine Karte spielen können.";
            break;
        case "noAce":
            message = "Sie haben kein Ass. Sie können dieses Opening nicht spielen.";
            break;
        case "noAceButAceOpening":
            message =
                "Sie haben eine Eröffnung gewählt, bei welcher als erste Karte ein Ass gespielt werden muss.";
            break;
        case "aceOrTrumpInHöherHat":
            message =
                "Sie haben eine Eröffnung gewählt, bei welcher kein Ass und kein Trumpf als erste Karte gespielt werden darf.";
            break;
        case "höherHatNotPossible":
            message =
                "Sie können diese Eröffnung nicht spielen, da sie keine Karte haben, die weder Trumpf noch ein Ass ist.";
            break;
        case "waitForCards":
            message = "Sie müssen warten, bis neue Karten ausgeteilt wurden.";
            break;
        case "lobbyFull":
            message = "Diese Lobby hat bereits die maximale Spieleranzahl von 6 Spielern erreicht.";
            break;
        // -------- Infos --------
        case "somebodyWonTheStich":
            message = `${detail} hat den Stich gewonnen.`;
            break;
        case "somebodyWonTheGame":
            message = `${detail} hat das Spiel gewonnen.`;
            break;
        case "newCards":
            message = "Es wurden neue Karten ausgeteilt.";
            break;
        case "playerLeft":
            message = `${detail} hat das Spiel verlassen. Die Lobby wird in 5 Sekunden geschlossen.`;
            break;
        case "meldenNotCurrentlyPlaying":
            message = `Sie können nur melden, wenn Sie die Runde beginnen.`;
            break;
        case "hatGemeldet":
            message = `${detail} hat gemeldet.`;
            break;
        case "hasToServe":
            message = `Sie müssen eine Karte in der selben Farbe spielen.`;
            break;
        default:
            break;
    }

    return (
        <Snackbar
            open={type !== ""}
            autoHideDuration={50000}
            onClose={reset}
            anchorOrigin={{
                vertical: snackbarType === "warning" ? "bottom" : "top",
                horizontal: "center",
            }}
            transitionDuration={0}
        >
            <Alert
                onClose={reset}
                severity={snackbarType === "warning" ? "warning" : "info"}
                className={classes.alert}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Popup;
