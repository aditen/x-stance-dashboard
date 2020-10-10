import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";

const theme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: {
                main: '#0066CC',
            },
            secondary: {
                main: '#007A3F'
            },
            error: {
                main: '#FF0000'
            }
        }, typography: {fontFamily: "Raleway"}
    })
);

export default theme;
