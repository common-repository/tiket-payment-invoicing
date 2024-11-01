import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Admin from './Tikex/Admin'

export default class Shortcode extends Component {
	render() {
		return <Admin />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
