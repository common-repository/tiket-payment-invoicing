/* global window, document */
if (!window._babelPolyfill) {
	require('@babel/polyfill')
}

import React from 'react'
import ReactDOM from 'react-dom'
import ProductsEditor from './containers/ProductsEditor.jsx'

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(
		<ProductsEditor wpObject={window.twppwr_object} />,
		document.getElementById('tiket-on-wordpress-productseditor')
	)
})
