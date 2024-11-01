import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ShoppingCartContainer from './Tikex/ShoppingCartContainer'

export default class Shortcode extends Component {
	render() {
		return (
			<ShoppingCartContainer
				teamSlug={this.props.wpObject.team_slug}
				adSlug={this.props.wpObject.ad_slug}
			/>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
