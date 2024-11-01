/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import PayeesEditor from './containers/PayeesEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<PayeesEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-payeeseditor')
	)
})
