import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LanguageSelect from './Tikex/LanguageSelect'

export default class Shortcode extends Component {
	render() {
		return <LanguageSelect teamId={this.props.wpObject.organization_short_id} />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
