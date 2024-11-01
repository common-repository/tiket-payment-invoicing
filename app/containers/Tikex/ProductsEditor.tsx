import React from 'react'
import { AuthProvider } from '../../../tikexModule/context/AuthContext'
import Login from '../../../tikexModule/components/Login'
import { GoogleOAuthProvider } from '@react-oauth/google'
import EventTimesEditorContent from './EventTimesEditorContent'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'

export default function Shortcode({}: {}) {
	const [selectedTeamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)

	return (
		<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
			<AuthProvider platform={'wordpress'}>
				<EventTimesEditorContent buttonClassName="button button-primary">
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							minHeight: 'calc(100vh - 32px)',
						}}
					>
						<Login
							completion={(userDTO) => {
								const urlParams = new URLSearchParams(window.location.search)
								const destinationUrl = urlParams.get('dst')

								if (userDTO) {
									const organizations = userDTO.teams
									if (organizations && Object.keys(organizations).length > 0) {
										const teamId = Object.keys(organizations)[0]
										//window.location.href = `/` + teamId
										setSelectedTeamId(teamId)
									}
								}
							}}
							platform={'wordpress'}
							createTeamIfNotExist={true}
						/>
					</div>
				</EventTimesEditorContent>
			</AuthProvider>
		</GoogleOAuthProvider>
	)
}
