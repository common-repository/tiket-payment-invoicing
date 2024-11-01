import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ShortcodeIn from './Tikex/ProgramDetail'

export default class ShortcodeOut extends Component {
	render() {
		return (
			<ShortcodeIn
				programId={this.props.wpObject.program_id}
				teamId={this.props.wpObject.organization_short_id}
			/>
		)
	}
}

ShortcodeOut.propTypes = {
	wpObject: PropTypes.object,
}
