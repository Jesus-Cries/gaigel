import { useState, useEffect } from "react";
import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Button, TextField, Box, Typography } from "@material-ui/core";

import Header from "./Header";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down("sm")]: {
                maxWidth: "420px",
            },
            [theme.breakpoints.up("md")]: {
                maxWidth: "800px",
            },
            padding: 20,
            borderRadius: 10,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "20px",
            boxShadow: "5px 5px 15px black",
        },
        textField: {
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: 4,
        },
    })
);

interface Props {
    login: (username: string, lobbycode: string) => void;
}

const LandingPage: React.FC<Props> = ({ login }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const [username, setUsername] = useState<string>("");
    const [lobbycode, setLobbycode] = useState<string>("");

    const handleUsernameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setUsername(event.target.value as string);
    };

    const handleLobbycodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setLobbycode(event.target.value as string);
    };

    const handleLogin = () => {
        if (username !== "" && lobbycode !== "") {
            login(username, lobbycode);
        }
    };

    useEffect(() => {
        const listener = (event: any) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                handleLogin();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    });

    return (
        <Box className={classes.root}>
            <Header />

            <Typography
                align="center"
                variant={matches ? "h5" : "h6"}
                style={{ maxWidth: "35ch", fontWeight: "lighter" }}
            >
                Entscheide dich für einen Nutzernamen und tritt einer Lobby bei!
            </Typography>

            <TextField
                className={classes.textField}
                color="primary"
                autoFocus
                variant="outlined"
                label="Nutzername"
                onChange={handleUsernameChange}
                inputProps={{ maxLength: 10 }}
            />

            <TextField
                className={classes.textField}
                variant="outlined"
                label="Lobbycode"
                onChange={handleLobbycodeChange}
                inputProps={{ maxLength: 10 }}
                helperText="Tipp: Bei einem bisher nicht verwendeten Lobbycode wird automatisch eine neue Lobby
                erstellt."
            />

            <Button
                disabled={username === "" || lobbycode === "" ? true : false}
                variant="contained"
                onClick={handleLogin}
                style={{ width: "100%" }}
            >
                Beitreten
            </Button>
        </Box>
    );
};

export default LandingPage;
