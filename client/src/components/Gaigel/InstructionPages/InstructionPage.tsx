import { makeStyles, createStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
            gap: "20px",
        },
        paragraph: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            gap: "5px",
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
    page: PageProps;
}

const InstructionPage: React.FC<Props> = ({ page }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box className={classes.root}>
            <Typography variant={matches ? "h5" : "h6"} style={{ fontWeight: "lighter" }}>
                {page.title}
            </Typography>

            {page.paragraphes.map((paragraph) => {
                return (
                    <Box className={classes.paragraph}>
                        <Typography
                            variant={matches ? "h6" : "body1"}
                            style={{ fontWeight: "normal", width: "100%" }}
                        >
                            {paragraph.title}
                        </Typography>
                        <Typography align="justify" variant={matches ? "body1" : "body2"}>
                            {paragraph.content}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default InstructionPage;
