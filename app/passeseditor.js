/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import PassesEditor from './containers/PassesEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<PassesEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-passeseditor')
	)
})
