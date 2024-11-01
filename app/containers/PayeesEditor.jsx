import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PayeesEditor from './Tikex/PayeesEditor'

export default class Shortcode extends Component {
	render() {
		return <PayeesEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
