/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import Teams from './containers/Teams.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<Teams wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-teams')
	)
})
