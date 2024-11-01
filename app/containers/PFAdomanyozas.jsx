import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ShortcodeIn from './Tikex/PFAdomanyozas'

export default class ShortcodeOut extends Component {
	render() {
		return (
			<ShortcodeIn
				adSlug={this.props.wpObject.ad_slug}
				planId={this.props.wpObject.plan_id}
				price={this.props.wpObject.price}
				adSubPageId={this.props.wpObject.ad_sub_page_id}
				teamSlug={this.props.wpObject.team_slug}
			/>
		)
	}
}

ShortcodeOut.propTypes = {
	wpObject: PropTypes.object,
}
