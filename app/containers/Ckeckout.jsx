import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AuthProvider } from '../../tikexModule/context/AuthContext'
import Checkout from '../../tikexModule/components/Checkout'
import { GoogleOAuthProvider } from '@react-oauth/google'

export default class Shortcode extends Component {
	render() {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '65vh',
					background: '#eeeeee',
				}}
			>
				<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
					<AuthProvider platform={'wordpress'}>
						<Checkout platform={'wordpress'} />
					</AuthProvider>
				</GoogleOAuthProvider>
			</div>
		)
	}
}

Shortcode.propTypes = {
	wpObject: PropTypes.object,
}
