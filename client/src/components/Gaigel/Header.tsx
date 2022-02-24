import { makeStyles, Theme, useTheme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.up("sm")]: {
                marginLeft: 120,
                marginRight: 120,
            },
            [theme.breakpoints.up("md")]: {
                gap: "30px",
            },

            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "20px",
        },
        logo: {
            width: "50px",
            [theme.breakpoints.up("md")]: {
                width: "60px",
            },
        },
    })
);

interface Props {}

const Header: React.FC<Props> = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <>
            <Box className={classes.root}>
                <img src={"/Header_symbols.png"} className={classes.logo} alt="" />
                <Typography
                    align="center"
                    variant={matches ? "h3" : "h4"}
                    style={{ fontWeight: "lighter" }}
                >
                    Gaigel
                </Typography>
                <img src={"/Header_symbols_mirror.png"} className={classes.logo} alt="" />
            </Box>

            <hr style={{ width: "100%" }} />
        </>
    );
};

export default Header;
