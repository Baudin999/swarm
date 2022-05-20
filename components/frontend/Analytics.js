import Analytics from 'analytics'


const consoleHeading = (text) => {
    console.log(`%c${text}`,"color: #e60167; font-family:Lato, 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold;padding: 1rem");
}
const consoleRow = (text) => {
    console.log(`%c${text}`,"color: #111; font-family:Lato, 'Courier New', Courier, monospace; font-size: 1rem; line-height: 1.5; padding: 1rem;");
}

const loadAnalyticsDisplay = (analyticsData, settings) => {
    window.showAnalytics = () => {
        const data = analyticsData;
        data.display = `${analyticsData.window.width}x${analyticsData.window.height}`;
        consoleRow("Below is the data we're sending to our analytics platform");
        console.table(data);
    }
}

const trackVisit = (data, config) => {
    fetch(config.target, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

const trackPagePlugin = (settings) => {
    return {
        name: 'essent-analytics',
        config: {
            target: settings.target,
        },
        initialize: ({ config }) => {
            // load provider script to page
        },
        page: ({ payload, config }) => {

            const blogAnalytics = {
                timestamp: payload.meta.ts,
                path: payload.properties.path,
                referrer: payload.properties.referrer,
                page: payload.properties.url,
                display: `${payload.properties.width}x${payload.properties.height}`
            }

            trackVisit(blogAnalytics, config);

            consoleHeading("Welcome to the Essent blog!");
            consoleRow("You're looking at the developer console, we're flattered 😊 The Essent blog is a static website. " +
                "We don't know what you expect to find here, but let us help you get started. This website doesn't use much javascript. " +
                "We do need to use javascript to do some very basic analytics as we have no server side logic. While we're very interested in you, we do not collect any data about you. " +
                "The only thing we're keeping track of is which pages are being visited, which previous page a visitor visited and the screen size of the visitor. " +
                "When you run showAnalytics() in the console we'll show you more details about the data we collect. " +
                "By the way, if you're interested in working at Essent please visit: https://www.werkenbijessent.nl/");

            loadAnalyticsDisplay(blogAnalytics, config);

        },
        track: () => {},
        identify: () => {},
        loaded: () => {
            return true
        }
    }
}


const analyze = () => {
    const analytics = Analytics({
        app: 'it.essent.nl',
        version: 1,
        debug: false,
        plugins: [
            trackPagePlugin({
                target: "https://it.essent.nl/api/pageVisitTrigger"
            }),
        ]
    })

    // We're making sure no UUID is being assigned to you
    analytics.setAnonymousId('it.essent.nl')
    analytics.page()
}

export default analyze;