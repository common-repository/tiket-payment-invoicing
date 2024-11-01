import React from 'react'
import { AuthProvider } from '../../../tikexModule/context/AuthContext'
import Login from '../../../tikexModule/components/Login'
import { GoogleOAuthProvider } from '@react-oauth/google'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'

export default function Shortcode({}: {}) {
	const [selectedTeamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '90vh',
				background: '#eeeeee',
			}}
		>
			<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
				<AuthProvider platform={'wordpress'}>
					<Login
						completion={(userDTO) => {
							const urlParams = new URLSearchParams(window.location.search)
							const destinationUrl = urlParams.get('dst')

							// Redirect to the destination URL
							if (destinationUrl) {
								window.location.href = destinationUrl
							}

							// Redirect to the destination URL
							if (destinationUrl == 'dashboard') {
								if (userDTO) {
									const organizations = userDTO.teams
									if (
										organizations &&
										Object.keys(organizations).length > 0 &&
										!selectedTeamId
									) {
										const teamId = Object.keys(organizations)[0]
										//window.location.href = `/` + teamId
										setSelectedTeamId(teamId)
									}
								}
							} else if (destinationUrl) {
								window.location.href = destinationUrl
							} else {
								window.location.href = '/'
							}
						}}
						platform={'wordpress'}
						createTeamIfNotExist={true}
					/>
				</AuthProvider>
			</GoogleOAuthProvider>
		</div>
	)
}
