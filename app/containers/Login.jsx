import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Login from './Tikex/Login'

export default class Shortcode extends Component {
	render() {
		return <Login />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
