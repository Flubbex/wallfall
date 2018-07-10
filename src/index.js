import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'

import listing from './listing'

import { unregister }from './registerServiceWorker'

import './bulma.theme.css'

import './qilla.css'

unregister()

ReactDOM.render(<App listing={listing} />, document.getElementById('root'));
//registerServiceWorker();
