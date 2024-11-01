import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Profile from './Tikex/Profile'

export default class Shortcode extends Component {
	render() {
		return <Profile />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
