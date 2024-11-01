import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EventTimesEditor from './Tikex/EventTimesEditor'

export default class Shortcode extends Component {
	render() {
		return <EventTimesEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
