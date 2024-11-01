import React, { useState, useEffect } from 'react'
import PurhaseForm from '../../../tikexModule/components/PurchaseForm'
import { AuthProvider } from '../../../tikexModule/context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserProductDTO } from '../../../tikexModule/Types/dto/user/product'
import { fetchWithBaseUrl } from '../../../utils/api'
import { StartPaymentReq } from '../../../tikexModule/Types/dto/startPayment'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorage'

export default function PurchaseFormContainer({
	teamSlug,
	productSlugIn,
}: {
	teamSlug: string
	productSlugIn: string
}) {
	const [productSlug, setProductSlug] = useState<string>(productSlugIn)
	const [programTicketsDTO, setProgramTicketsDTO] = useState<
		UserProductDTO | undefined
	>(undefined)
	const [startPaymentReqs, setStartPaymentReqs] = useLocalStorage<{
		[programId: string]: Partial<StartPaymentReq>
	}>('startPaymentReqs', {})
	const [isCheckoutVisible, setIsCheckoutVisible] = useState<Boolean>(false)

	useEffect(() => {
		fetchWithBaseUrl(
			`user/product?teamSlug=${teamSlug}&productSlug=${productSlug}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(async (response) => {
			if (response.ok) {
				const data = await response.json()
				setProgramTicketsDTO(data)
			}
		})
	}, [teamSlug, productSlug])

	useEffect(() => {
		window.addEventListener('userProductSlugChanged', (event: any) => {
			setProductSlug(event.detail)
			setIsCheckoutVisible(false)
		})
		window.addEventListener('startPaymentReqsChanged', (event: any) => {
			setStartPaymentReqs(event.detail)
		})
		return () => {
			window.removeEventListener('userProductSlugChanged', () => {})
			window.removeEventListener('startPaymentReqsChanged', () => {})
		}
	}, [])

	return (
		<div className="form-box">
			<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
				<AuthProvider platform={'wordpress'}>
					{programTicketsDTO && (
						<PurhaseForm
							teamSlug={teamSlug}
							buyTicketData={programTicketsDTO}
							productSlug={productSlug}
							platform={'wordpress'}
							startPaymentReqs={startPaymentReqs}
							setStartPaymentReqs={setStartPaymentReqs}
							isCheckoutVisible={isCheckoutVisible}
							setIsCheckoutVisible={setIsCheckoutVisible}
						/>
					)}
				</AuthProvider>
			</GoogleOAuthProvider>
		</div>
	)
}
