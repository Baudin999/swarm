import React from "react"
import Page from "./Page"
import globalState from './globalState.js'

export default function Styleguide() {
    // get the content from the global

    var orgs = globalState.getState('orgs');
    var authors = globalState.getState('authors');
    var blogs = globalState.getState('all_blogs');

    var items = [
        ...blogs.map(b => ({
            name: (b.title || b.name).toLowerCase(),
            url: b.url
        })),

        ...authors.map(b => ({
            name: (b.title || b.name).toLowerCase(),
            url: b.url
        })),

        ...orgs.map(b => ({
            name: (b.title || b.name).toLowerCase(),
            url: b.url
        }))
    ];

    var html = `
<script>
var items = ${JSON.stringify(items, null, 4)}

function search() {
    var searchField = document.getElementById('search-field');
    var searchValue = searchField.value.toLowerCase();
    var searchResults = document.getElementById('search-results');
    var results = items.filter(i => i.name.indexOf(searchValue) > -1);

    if (!results || results.length === 0) {
        searchResults.innerHTML = 'Could not find anything';
    }
    else {
        searchResults.innerHTML = '';
        results.forEach(result => {
            let element = document.createElement('div');
            let content = \`<a href='\${result.url}'>\${result.name}</a>\`;
            element.innerHTML = content;
            searchResults.appendChild(element);
        });
    }
}

var button = document.getElementById('search-field-execute');
button.addEventListener('click', search, false);

</script>
    `;

    return (
        <Page>
            <input id="search-field" />
            <button id="search-field-execute">Search</button>

            <div id="search-results" />
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </Page>
    )




}