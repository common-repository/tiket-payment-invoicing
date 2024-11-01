import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsEditor from './Tikex/FormsEditor'

export default class Shortcode extends Component {
	render() {
		return <FormsEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
