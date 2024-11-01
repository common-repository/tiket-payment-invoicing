/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import Profile from './containers/Profile.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<Profile wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-profile')
	)
})
