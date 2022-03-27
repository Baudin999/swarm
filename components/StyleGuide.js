import React from "react"
import Page from "./Page"
import globalState from './globalState.js'

export default function Styleguide() {
    // get the content from the global

    var orgs = globalState.getState('orgs');
    var blogs = globalState.getState('all_blogs');

    return (
        <Page>
            <p>You can get all of the organisations by using the global state:</p>
            <pre>
                <code>
                    {JSON.stringify(orgs, null, 4)}
                </code>
            </pre>

            <p>You can also get all of the blogs from the global state:</p>
            <pre>
                <code>
                import globalState from './globalState.js'
                var blogs = globalState.getState('all_blogs');
                </code>
            </pre>
            <pre>
                <code>
                    {JSON.stringify(blogs, null, 4)}
                </code>
            </pre>
        </Page>
    )




}