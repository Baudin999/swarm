# Swarm: The simple Blog app


How to get started with developement:

 1. `git clone https://github.com/Baudin999/swarm.git`
 1. `npm i` or `yarn`
 1. Now we build the cli tool: `npm run rollup`
 1. Uninstall a previous version of swarm:
    `npm uninstall -g` 
 1. Install swarm: `npm i -g`
 1. Initialize swarm: `swarm init`
 1. Pull the content: `swarm content pull`
 1. Build the content: `swarm content build`
 1. Serve the content: `swarm serve`
 1. Go to localhost:3000 and see the content.


Development of swarm is still not as smooth as we'd like. All commands and setup is done in three different folders:

 1. `tools` - This is where all the tools live. Here we can find the queries which are run against the file system.
 1. `styles` - the `.less` files which we use to style the application. Keep in mind that all the styling needs to be done through these less files. Eventually we will want to *eject* from the defaults and that is only possible if all styling is in a style sheet.
 1. `components` - the React components used to render the application. Treat them as normal react components.

## Comments

To run the comments you will need to compile the comments js file:

```
npx rollup -c ./rollup.comments.js
```

The `comments.js` file should now appear in the `dist` folder. This file is automatically referenced in each blog post file.


## Global State
The global state is state which is used when rendering the pages in the build step. You can use this global state freely. It will not appear in the client.

```jsx
import state from '../components/globalState';

const allBlogs = state.getState('all_blogs');

export default function() {
    return (
        <div>{allBlogs.length}</div>
    );
}
```