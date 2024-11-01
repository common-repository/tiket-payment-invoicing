import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translation from './Tikex/Translation'

export default class Shortcode extends Component {
	render() {
		return (
			<Translation
				textId={this.props.wpObject.text_id}
				className={this.props.wpObject.class_name}
			/>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
