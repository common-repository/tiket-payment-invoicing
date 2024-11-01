import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ShortcodeIn from './Tikex/ProgramList'

export default class ShortcodeOut extends Component {
	render() {
		return (
			<ShortcodeIn
				postId={this.props.wpObject.post_id}
				teamId={this.props.wpObject.organization_short_id}
			/>
		)
	}
}

ShortcodeOut.propTypes = {
	wpObject: PropTypes.object,
}
