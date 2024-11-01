import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PremiumContent from './Tikex/PremiumContent'

export default class Shortcode extends Component {
	render() {
		return (
			<PremiumContent
				programId={this.props.wpObject.program_id}
				teamId={this.props.wpObject.organization_short_id}
			/>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
