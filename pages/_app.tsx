import React from 'react';
import App from "next/app";
import {MuiThemeProvider} from "@material-ui/core";
import theme from "../src/styles/theme";
import getConfig from "next/config";


const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();

class MyApp extends App {

    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const {Component, pageProps} = this.props;
        return (
            <React.Fragment>
                <style global jsx>
                    {`
                    body {
                      margin: 0;
                      padding: 0;
                    }
                    @supports ( -ms-accelerator:true ) {
                        html{
                            overflow: hidden;
                            height: 100%;    
                        }
                        body{
                            overflow: auto;
                            height: 100%;
                        }
                    }
                    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
                        html{
                            overflow: hidden;
                            height: 100%;    
                        }
                        body{
                            overflow: auto;
                            height: 100%;
                        }
                    }
                  `}
                </style>
                <MuiThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}

export default MyApp;
