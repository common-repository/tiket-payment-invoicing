import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TranslationsEditor from './Tikex/TranslationsEditor'

export default class Shortcode extends Component {
	render() {
		return <TranslationsEditor />
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
