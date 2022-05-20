import url from "./../components/Url";
import React from "react";
import Layout from './Layout';
import { getSettings } from "./../tools/swarm.settings";

export default function Page({ SEO, children, baseUrl }) {
    let settings = getSettings() || {};

    if (!SEO) SEO = {};
    if (!SEO.title) SEO.title = settings.title || "swarm - blogging engine";
    if (!SEO.description) SEO.description = settings.description || "swarm - blogging engine";

    return (
        <html lang="en">
            <head>
                <title>{SEO.title}</title>
                {baseUrl && <base href={baseUrl}></base>}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                {SEO.title && <meta name="title" content={SEO.title} />}
                {SEO.description && <meta name="description" content={SEO.description} />}

                <link rel="stylesheet" type="text/css" href={url("/styles.css")} />
                <script src="/app.js" defer></script>

            </head>
            <body>
                <Layout>
                    {children}
                </Layout>

            </body>
        </html>
    );
}
