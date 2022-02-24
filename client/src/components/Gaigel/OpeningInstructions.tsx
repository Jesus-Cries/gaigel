import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, IconButton, Typography, Card, MobileStepper } from "@material-ui/core";
import { useState, useRef } from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            zIndex: 50,
            position: "fixed",
            top: "45%",
            left: "50%",
            width: "30%",
            maxWidth: "500px",
            minWidth: "300px",
            transform: "translate(-50%, -50%)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "15px",
            boxShadow: "5px 5px 15px black",
        },
        buttons: {
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            gap: "20px",
        },
    })
);

interface Props {}

const OpeningInstructions: React.FC<Props> = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const [currentPage, setCurrentPage] = useState<number>(0);
    const backButton = useRef(null);
    const nextButton = useRef(null);

    let instructions: string[] = [
        "Bei dieser Eröffnungsmöglichkeit wird ein Ass verdeckt durch die Vorhand gespielt. Alle anderen Spieler spielen nun auch verdeckt jeweils eine Karte. Der Stich gehört dem Spieler, der das gleiche Ass wie die Vorhand gespielt hat. Ist dies nicht der Fall, gehört der Stich der Vorhand.",
        "In dieser Eröffnungsmöglichkeit wird das Ass von der Vorhand offen ausgespielt. Die anderen Spieler können nun eine beliebige Karte offen abwerfen. Der Stich geht dann an den Spielbeginner.",
        "Bei Höher hat wird eine Karte verdeckt ausgespielt, welche weder ein Ass, noch ein Trumpf ist. Auch die anderen Spieler spielen jeweils eine verdeckte Karte aus. Der Stich geht an den Spieler, welcher eine Karte mit der gleichen Farbe, aber mit höherem Wert gelegt hat. Wird keine Karte der gleichen Farbe mit höherem Wert gelegt, so geht der Stich an die Vorhand.",
        "Eine weitere Eröffnungsmöglichkeit ist Dissle. Sagt die Vorhand zu Beginn des Spiels, dass auf Dissle gespielt wird, so gewinnt die Vorhand das Spiel, falls sie im Verlauf des Spiels fünf Siebener gleichzeitig besitzt. Die Gegner können bereits vorher das reguläre Spielende erreichen. Die Vorhand hat das Spiel verloren, wenn sie einen Stich gewinnt.",
    ];
    let instructionTitles: string[] = ["Andere Alte hat", "Ge-Elfen", "Höher hat", "Auf Dissle"];

    const pageDown = () => {
        let newPage = currentPage - 1 < 0 ? 0 : currentPage - 1;
        setCurrentPage(newPage);
    };

    const pageUp = () => {
        let newPage = currentPage + 1 > 3 ? 0 : currentPage + 1;
        setCurrentPage(newPage);
    };

    return (
        <Card className={classes.root}>
            <Box className={classes.buttons}>
                <IconButton ref={backButton} onClick={pageDown}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant={matches ? "h5" : "h6"} style={{ fontWeight: "lighter" }}>
                    {instructionTitles[currentPage]}
                </Typography>
                <IconButton ref={nextButton} onClick={pageUp}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <Typography variant={matches ? "body1" : "caption"}>
                {instructions[currentPage]}
            </Typography>

            <MobileStepper
                style={{ backgroundColor: "white" }}
                position="static"
                variant="dots"
                steps={4}
                activeStep={currentPage}
                backButton={<></>}
                nextButton={<></>}
            ></MobileStepper>
        </Card>
    );
};

export default OpeningInstructions;
