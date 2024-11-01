import React, { useEffect, useState } from 'react'
import { AuthProvider } from '../../../tikexModule/context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import UserCalendar from './UserCalendar'

export default function UserCalendarContainer({
	teamSlug,
	adSlug,
}: {
	teamSlug: string
	adSlug: string
}) {
	return (
		<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
			<AuthProvider platform={'wordpress'}>
				<UserCalendar teamSlug={teamSlug} adSlug={adSlug} />
			</AuthProvider>
		</GoogleOAuthProvider>
	)
}
