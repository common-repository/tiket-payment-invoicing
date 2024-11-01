import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PassesEditor from './Tikex/PassesEditor'

export default class Shortcode extends Component {
	render() {
		return <PassesEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
