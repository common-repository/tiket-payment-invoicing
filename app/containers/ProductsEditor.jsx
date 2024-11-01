import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProductsEditor from './Tikex/ProductsEditor'

export default class Shortcode extends Component {
	render() {
		return <ProductsEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
