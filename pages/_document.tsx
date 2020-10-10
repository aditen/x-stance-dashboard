import Document, {Head, Html, Main, NextScript} from 'next/document';
import theme from "../src/styles/theme";
import React from "react";
import {ServerStyleSheets} from "@material-ui/styles";
import getConfig from "next/config";

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();

export default class MyDocument extends Document {
    static async getInitialProps(ctx: any) {
        const initialProps = await Document.getInitialProps(ctx);
        return {...initialProps};
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                    <meta key="theme-color" name="theme-color" content={theme.palette.primary.main}/>
                    <meta key="og:image" name="og:image" content="/ad_iten_sw_engineer.jpg"/>
                    <meta key="og:width" name="og:width" content="100"/>
                    <meta key="og:height" name="og:height" content="100"/>
                    <meta key="og:alt" name="og:alt" content="Image of coding"/>
                    <link rel="apple-touch-icon" href="/favicon.ico"/>
                    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
                </Head>
                <body style={{margin: 0}}>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps = async ctx => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: any) => (props: any) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
