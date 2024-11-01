/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import FormsEditor from './containers/FormsEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<FormsEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-formseditor')
	)
})
