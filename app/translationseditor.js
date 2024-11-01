/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import TranslationsEditor from './containers/TranslationsEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<TranslationsEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-translationseditor')
	)
})
