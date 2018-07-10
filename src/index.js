import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'

import listing from './listing'

//import { unregister } from './registerServiceWorker'

import './bulma.theme.css'

import './qilla.css'

ReactDOM.render(<App listing={listing} />, document.getElementById('root'));

