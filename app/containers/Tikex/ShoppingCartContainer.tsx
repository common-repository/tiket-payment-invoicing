import React, { useState, useEffect } from 'react'
import ShoppingCart from '../../../tikexModule/components/ShoppingCart'
import { AuthProvider } from '../../../tikexModule/context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserProductDTOFields } from '../../../tikexModule/Types/dto/user/product'
import { fetchWithBaseUrl } from '../../../utils/api'
import { StartPaymentFrontend } from '../../../tikexModule/Types/dto/startPayment'
import useLocalStorageTX2 from '../../../tikexModule/hooks/useLocalStorageTX2'

export default function ShoppingCartContainer({
	teamSlug,
	adSlug,
}: {
	teamSlug: string
	adSlug: string
}) {
	const [programTicketsDTO, setProgramTicketsDTO] = useState<
		UserProductDTOFields | undefined
	>(undefined)
	const [startPaymentFrontend, setStartPaymentFrontend] =
		useLocalStorageTX2<StartPaymentFrontend>('startPaymentFrontend.v4', {
			adSubPagesData: {},
			formFieldData: {},
			partnerData: { country: 'Magyarország' },
		})
	const [isCheckoutVisible, setIsCheckoutVisible] = useState<Boolean>(false)
	const [fetchUserProductState, setFetchUserProductState] =
		useState<string>('created')

	const [teamSlugUser, setTeamSlugUser] = useLocalStorageTX2<string>(
		'teamSlugUser',
		teamSlug,
		true
	)
	const [adSlugUser, setAdSlugUser] = useLocalStorageTX2<string>(
		'productSlugUser',
		adSlug,
		true
	)
	const [planId, setPlanId] = useLocalStorageTX2<string>('planId', '')
	const [isLoginVisible, setIsLoginVisible] = useState<Boolean>(false)
	const [adSubPageId, setAdSubPageId] = useLocalStorageTX2<string>(
		'adSubPageId',
		''
	)

	useEffect(() => {
		if (
			!teamSlug ||
			!adSlug ||
			!startPaymentFrontend ||
			fetchUserProductState == 'started' ||
			fetchUserProductState == 'finished'
		) {
			return
		}
		const startPaymentFrontendString = JSON.stringify(startPaymentFrontend)

		// Encode the JSON string to be URL safe
		const encodedStartPaymentFrontend = encodeURIComponent(
			startPaymentFrontendString
		)

		setFetchUserProductState('started')
		fetchWithBaseUrl(
			`user/product?teamSlug=${teamSlug}&adSlug=${adSlug}&startPaymentFrontend
			=${encodedStartPaymentFrontend}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then(async (response) => {
				if (response.ok) {
					const data = await response.json()
					setProgramTicketsDTO(data)
				}
				setFetchUserProductState('finished')
			})
			.catch((e) => {
				setFetchUserProductState('finished')
			})
	}, [teamSlug, adSlug, startPaymentFrontend, fetchUserProductState])

	useEffect(() => {
		window.addEventListener('userProductSlugChanged', (event: any) => {
			setAdSlugUser(event.detail)
			setIsCheckoutVisible(false)
		})
		window.addEventListener('startPaymentReqsChanged', (event: any) => {
			setStartPaymentFrontend(event.detail)
		})
		return () => {
			window.removeEventListener('userProductSlugChanged', () => {})
			window.removeEventListener('startPaymentReqsChanged', () => {})
		}
	}, [])

	return (
		<div className="form-box" id="purchase-form-container">
			<GoogleOAuthProvider clientId="396595957094-scievt3atnha34arfroao2obv8c5utoa.apps.googleusercontent.com">
				<AuthProvider platform={'wordpress'}>
					{fetchUserProductState != 'finished' && (
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
					{programTicketsDTO && adSlugUser && startPaymentFrontend && (
						<ShoppingCart
							teamSlug={teamSlug}
							userProductDTO={programTicketsDTO}
							adSlug={adSlugUser}
							platform={'wordpress'}
							startPaymentFrontend={startPaymentFrontend}
							setStartPaymentFrontend={setStartPaymentFrontend}
							adSubPageId={adSubPageId}
							setAdSubPageId={setAdSubPageId}
							planId={planId}
							setPlanId={setPlanId}
							isCheckoutVisible={isCheckoutVisible}
							setIsCheckoutVisible={setIsCheckoutVisible}
							isLoginVisible={isLoginVisible}
							setIsLoginVisible={setIsLoginVisible}
						/>
					)}
				</AuthProvider>
			</GoogleOAuthProvider>
		</div>
	)
}
