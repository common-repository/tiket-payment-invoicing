import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Teams from './Tikex/Teams'

export default class Shortcode extends Component {
	render() {
		return <Teams />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
