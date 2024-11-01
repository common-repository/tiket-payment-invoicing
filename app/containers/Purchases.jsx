import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Purchases from './Tikex/Purchases'

export default class Shortcode extends Component {
	render() {
		return <Purchases />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
