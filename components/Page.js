import url from "./../components/Url";
import React from "react";
import Layout from './Layout';


export default function Page({ SEO, children, baseUrl }) {

    if (!SEO) SEO = {};
    if (!SEO.title) SEO.title = "swarm - blogging engine";
    if (!SEO.description) SEO.description = "swarm - blogging engine";

    return (
        <html lang="en">
            <head>
                <title>{SEO.title}</title>
                {baseUrl && <base href={baseUrl}></base>}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta httpEquiv="Content-Security-Policy" content="script-src 'self' https://unpkg.com"></meta>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                {SEO.title && <meta name="title" content={SEO.title} />}
                {SEO.description && <meta name="description" content={SEO.description} />}

                <link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' as='font' type='text/css' />
                <link rel="stylesheet" type="text/css" href={url("/styles.css")} />

                <script crossOrigin="true" src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                <script crossOrigin="true" src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            </head>
            <body>
                <Layout>
                    {children}
                </Layout>

            </body>
        </html>
    );
}
