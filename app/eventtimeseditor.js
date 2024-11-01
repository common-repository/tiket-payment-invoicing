/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import EventTimesEditor from './containers/EventTimesEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<EventTimesEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-eventtimeseditor')
	)
})
