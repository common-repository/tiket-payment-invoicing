import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EventsEditor from './Tikex/EventsEditor'

export default class Shortcode extends Component {
	render() {
		return <EventsEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
