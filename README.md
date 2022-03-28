# Swarm: The simple Blog app

Swarm is created to really give a simple feeling to blogging. It works as expected, 
just add your content to the Content directory which is structured as:
- Company[]
   - Author[]
      - Blog[]


Get the latest version of the repository:

```
git clone https://github.com/Baudin999/swarm.git
cd swarm
yarn
```

Because we are eventually going to support authentication we need to create an `app.config.json` in the root of the project, same level as the `package.json`. You can fill the file with:

```
{
    "clientId": "",
    "clientSecret": ""
}
```
To start the development server run:
```
npm run server
```

If you want to start developing with a watch on the files, run:
```
npm run dev
```
A browser will automatically be openend at the right location http://localhost:3000. Look at the `package.json` to see the different scripts you can run. 

