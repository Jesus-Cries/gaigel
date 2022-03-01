import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { Box, Typography, Card, IconButton, MobileStepper } from "@material-ui/core";
import { useState } from "react";

import InstructionPage from "./InstructionPages/InstructionPage";
import FirstInstructionPage from "./InstructionPages/FirstInstructionPage";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            zIndex: 60,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
            gap: "10px",
            boxShadow: "5px 5px 15px black",
        },
        headerButton: {
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
        },
        header: {
            fontWeight: "lighter",
        },
        closeButton: {
            position: "absolute",
            top: "0px",
            right: "0px",
        },
    })
);

interface ParagraphProps {
    title: string;
    content: string;
}

interface PageProps {
    title: string;
    paragraphes: ParagraphProps[];
}

interface Props {
    toggleShowInstructions: () => void;
}

const Instructions: React.FC<Props> = ({ toggleShowInstructions }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const [currentPage, setCurrentPage] = useState<number>(0);

    const pages: PageProps[] = [
        {
            title: "Einleitung",
            paragraphes: [
                {
                    title: "Lobby erstellen",
                    content:
                        'Um eine Lobby zu erstellen, geben Sie einfach einen Nutzernamen und einen Lobbycode ein, unter welchem Sie eine Lobby erstellen wollen. Andere Spieler können Ihrer Lobby nun beitreten, wenn sie denselben Lobbycode eingeben. Drücken sie dann auf "Beitreten".',
                },
                {
                    title: "Lobby beitreten",
                    content:
                        'Wenn Sie einer Lobby beitreten wollen, gehen Sie vor wie beim Erstellen einer Lobby: Wählen Sie einen Nutzernamen und geben Sie den Lobbycode ein, unter welchem die Lobby erstellt wurde. Drücken sie dann auf "Beitreten".',
                },
                {
                    title: "Spiel starten",
                    content:
                        'Sobald alle Spieler auf "Bereit" geklickt haben und die Spieleranzahl 2, 3, 4 oder 6 Spielern liegt wird das Spiel gestartet.',
                },
            ],
        },
        {
            title: "Spielverlauf",
            paragraphes: [
                {
                    title: "Stiche",
                    content:
                        "Zu Beginn einer regulären Runde spielt die Person, die den letzten Stich gewonnen hat, eine beliebige Karte offen aus. Daraufhin können die anderen Spieler nacheinander Karten hinzulegen. Sobald jeder Spieler eine Karte gelegt hat wird entschieden, wer den Stich gewonnen hat. Gewonnen hat der, der eine Karte mit der gleichen Farbe, wie die der ersten Karte, aber mit einem höheren Wert oder wer den höchsten Trumpf gelegt hat. Wurde keine höhere Karte und kein Trumpf gelegt, so gewinnt der Spieler, der die erste Karte gelegt hat.",
                },
                {
                    title: "Bedienen",
                    content:
                        "Sobald der Talon leer ist, also keine Karten mehr zum Nachziehen vorhanden sind, besteht Bedienpflicht. Wenn man also eine Karte besitzt, die die gleiche Farbe wie die erste Karte des Stiches hat, so muss diese gelegt werden.",
                },
            ],
        },
        {
            title: "Eröffnungen 1/2",
            paragraphes: [
                {
                    title: "",
                    content:
                        "Bei Gaigel kann die Vorhand, also die Person, die am Anfang der Runde als Erste ausspielen darf, zwischen vier verschiedenen Eröffnungen wählen. Diese werden auf dieser und der nächsten Seite erklärt.",
                },
                {
                    title: "Andere Alte",
                    content:
                        "Bei dieser Eröffnungsmöglichkeit wird ein Ass verdeckt durch die Vorhand gespielt. Alle anderen Spieler spielen nun auch verdeckt jeweils eine Karte. Der Stich gehört dem Spieler, der das gleiche Ass wie die Vorhand gespielt hat. Ist dies nicht der Fall, gehört der Stich der Vorhand.",
                },
                {
                    title: "Ge-Elfen",
                    content:
                        "In dieser Eröffnungsmöglichkeit wird das Ass von der Vorhand offen ausgespielt. Die anderen Spieler können nun eine beliebige Karte offen abwerfen. Der Stich geht dann an den Spielbeginner.",
                },
            ],
        },
        {
            title: "Eröffnungen 2/2",
            paragraphes: [
                {
                    title: "Höher hat",
                    content:
                        "Bei Höher hat wird eine Karte verdeckt ausgespielt, welche weder ein Ass, noch ein Trumpf ist. Auch die anderen Spieler spielen jeweils eine verdeckte Karte aus. Der Stich geht an den Spieler, welcher eine Karte mit der gleichen Farbe, aber mit höherem Wert gelegt hat. Wird keine Karte der gleichen Farbe mit höherem Wert gelegt, so geht der Stich an die Vorhand.",
                },
                {
                    title: "Auf Dissle",
                    content:
                        "Eine weitere Eröffnungsmöglichkeit ist Dissle. Sagt die Vorhand zu Beginn des Spiels, dass auf Dissle gespielt wird, so gewinnt die Vorhand das Spiel, falls sie im Verlauf des Spiels fünf Siebener gleichzeitig besitzt. Die Gegner können bereits vorher das reguläre Spielende erreichen. Die Vorhand hat das Spiel verloren, wenn sie einen Stich gewinnt. In diesem Fall gewinnen alle anderen Spieler.",
                },
            ],
        },
        {
            title: "Besondere Regeln",
            paragraphes: [
                {
                    title: "Melden",
                    content:
                        "Besitzt ein Spieler sowohl den Ober als auch den König derselben Farbe, so kann er dieses Paar melden. Für ein normales Paar gibt es 20 und für ein Paar in Trumpffarbe 40 Punkte. Gemeldet werden kann nur, wenn der Spieler zuvor einen Stich gemacht hat und nun die nächste Runde beginnen kann. In dieser nächsten Runde muss eine der beiden gemeldeten Karten gespielt werden.",
                },
                {
                    title: "Rauben",
                    content:
                        "Besitzt ein Spieler die Trumpf Sieben, so kann diese gegen die Karte getauscht werden, die zu Beginn des Spiels als Trumpfkarte gewählt wurde. Geraubt werden kann nur, wenn der Spieler zuvor einen Stich gemacht hat und nun die nächste Runde beginnen kann.",
                },
            ],
        },
    ];

    const amountOfPages: number = pages.length;

    const pageDown = () => {
        let newPage = currentPage - 1 < 0 ? amountOfPages : currentPage - 1;
        setCurrentPage(newPage);
    };

    const pageUp = () => {
        let newPage = currentPage + 1 > amountOfPages ? 0 : currentPage + 1;
        setCurrentPage(newPage);
    };

    return (
        <Card className={classes.root}>
            <Box
                className={classes.headerButton}
                style={matches ? { gap: "20px" } : { gap: "10px" }}
            >
                <IconButton onClick={pageDown}>
                    <ArrowBackIosIcon fontSize={matches ? "large" : "medium"} />
                </IconButton>
                <Typography
                    align="center"
                    variant={matches ? "h4" : "h5"}
                    className={classes.header}
                >
                    Anleitung
                </Typography>
                <IconButton onClick={pageUp}>
                    <ArrowForwardIosIcon fontSize={matches ? "large" : "medium"} />
                </IconButton>

                <IconButton className={classes.closeButton} onClick={toggleShowInstructions}>
                    <CloseIcon fontSize={matches ? "large" : "medium"} />
                </IconButton>
            </Box>

            <hr style={{ width: "100%" }} />

            {currentPage === 0 ? (
                <InstructionPage page={pages[0]} />
            ) : currentPage === 1 ? (
                <FirstInstructionPage />
            ) : (
                <InstructionPage page={pages[currentPage - 1]} />
            )}

            <MobileStepper
                style={{ backgroundColor: "white" }}
                position="static"
                variant="dots"
                steps={amountOfPages + 1}
                activeStep={currentPage}
                backButton={<></>}
                nextButton={<></>}
            ></MobileStepper>
        </Card>
    );
};

export default Instructions;
