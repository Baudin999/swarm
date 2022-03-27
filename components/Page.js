import React from "react";
import Layout from './Layout';

export default function Page({SEO, children}) {

    if (!SEO) SEO = {};

    return (
        <html>
            <head>
                <title>{SEO.title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                {SEO.title && <meta name="title" content={SEO.title} />}
                {SEO.description && <meta name="description" content={SEO.description} />}

                <link rel="stylesheet" type="text/css" href="/styles.css" />
            </head>
            <body>
                <Layout>
                    {children}
                </Layout>
            </body>
        </html>
    );
}

