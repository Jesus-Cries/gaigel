import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Fab } from "@material-ui/core";

// This is the old import for the icons
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            zIndex: 100,
            backgroundColor: "#fafafa",
            boxShadow: "4px 4px 15px #444",
        },
    })
);

interface Props {
    toggleShowInstructions: () => void;
    invisible?: boolean;
}

const HelpButton: React.FC<Props> = ({ toggleShowInstructions, invisible = false }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Fab
            size={matches ? "large" : "small"}
            className={classes.root}
            onClick={toggleShowInstructions}
            disabled={invisible}
            style={invisible ? { opacity: 0 } : {}}
        >
            <QuestionMarkIcon fontSize={matches ? "medium" : "small"} />
        </Fab>
    );
};

export default HelpButton;
