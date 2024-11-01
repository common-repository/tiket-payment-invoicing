import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormContainer from './Tikex/FormContainer'

export default class Shortcode extends Component {
	render() {
		return (
			<FormContainer
				teamSlug={this.props.wpObject.team_slug}
				formId={this.props.wpObject.form_id}
			/>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
