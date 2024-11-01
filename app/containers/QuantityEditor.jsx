import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuantityEditor from './Tikex/QuantityEditor'

export default class Shortcode extends Component {
	render() {
		return (
			<QuantityEditor
				programId={this.props.wpObject.program_id}
				invoiceItemId={this.props.wpObject.invoice_item_id}
				formFieldId={this.props.wpObject.form_field_id}
			/>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
