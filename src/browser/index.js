import React from 'react'
import { hydrate } from 'react-dom'
import App from '../shared/App'
import { BrowserRouter } from 'react-router-dom'

// tells react markup is already created on the server
// just do anything needed to do without actully reproducing all the work on the server
// i.e. attach event handlers to the existing server markup
hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);