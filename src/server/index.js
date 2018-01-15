import express from "express"
import cors from "cors"
import { renderToString } from "react-dom/server"
import App from '../shared/App'
import React from 'react'
import serialize from "serialize-javascript"
import { matchPath, StaticRouter } from "react-router-dom"
import routes from '../shared/routes'

const app = express()

app.use(cors())

app.get("*", (req, res, next) => {
  // find the path matched with the get request
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

  // see if there's any data the route needs if there is fetch it, if not resolve promise
  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve()

  promise.then((data) => {
    const context = { data }

    const markup = renderToString(
      // StaticRouter Location is never changing from the server
      // location is the current location being requested by the user
      // Any object passed to context can be access later on in any component as props.staticContext
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    )

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>
          <script src="/bundle.js" defer></script>
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
        </head>

        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
  }).catch(next)
})

app.listen(3000, () => {
  console.log(`Server is listening on port: 3000`)
})