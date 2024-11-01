/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import EventsEditor from './containers/EventsEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<EventsEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-eventseditor')
	)
})
