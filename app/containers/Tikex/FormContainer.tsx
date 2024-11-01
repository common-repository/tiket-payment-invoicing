import React, { useState, useEffect } from 'react'
import { AuthProvider } from '../../../tikexModule/context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { fetchWithBaseUrl } from '../../../utils/api'
import useLocalStorageTX2 from '../../../tikexModule/hooks/useLocalStorageTX2'
import FormContainer from '../../../tikexModule/components/FormContainer'
import { Form } from '../../../tikexModule/Types/models/team'

export default function PurchaseFormContainer({
	teamSlug,
	formId,
}: {
	teamSlug: string
	formId: string
}) {
	const [formSchema, setFormSchema] = useState<Form | undefined>(undefined)
	const [isFetchUserProductInProgress, setIsFetchUserProductInProgress] =
		useState<Boolean>(false)
	const [formData, setFormData] = useLocalStorageTX2<{
		[formFieldId: string]: any
	}>('formData', {})
	const [isLoginDialogOpenContainer, setIsLoginDialogOpenContainer] =
		useState<Boolean>(false)

	useEffect(() => {
		fetchWithBaseUrl(`user/form?teamSlug=${teamSlug}&formId=${formId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(async (response) => {
				if (response.ok) {
					const data = await response.json()
					setFormSchema(data)
				}
				setIsFetchUserProductInProgress(false)
			})
			.catch((e) => {
				setIsFetchUserProductInProgress(false)
			})
	}, [])

	return (
		<div className="form-box" id="purchase-form-container">
			<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
				<AuthProvider platform={'wordpress'}>
					{isFetchUserProductInProgress && (
						<img
							src={
								'https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif'
							}
							width={20}
							height={20}
							style={{
								width: '20px',
								height: '20px',
								marginTop: '45px',
							}}
						/>
					)}
					{formSchema && (
						<FormContainer
							teamSlug={teamSlug}
							formId={formId}
							formSchema={formSchema}
							setIsLoginDialogOpenContainer={setIsLoginDialogOpenContainer}
							platform={'next'}
							formData={formData}
							setFormData={setFormData}
						/>
					)}
				</AuthProvider>
			</GoogleOAuthProvider>
		</div>
	)
}
