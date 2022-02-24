import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Box, Typography, Card, Button, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
    })
);

interface Props {}

const InstructionPage1: React.FC<Props> = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return <Box className={classes.root}>EE</Box>;
};

export default InstructionPage1;
