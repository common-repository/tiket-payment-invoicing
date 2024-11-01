import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserCalendarContainer from './Tikex/CalendarContainer'

export default class Shortcode extends Component {
	render() {
		return (
			<UserCalendarContainer
				teamSlug={this.props.wpObject.team_slug}
				adSlug={this.props.wpObject.ad_slug}
			/>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
