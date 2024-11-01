/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import Purchases from './containers/Purchases.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<Purchases wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-purchases')
	)
})
