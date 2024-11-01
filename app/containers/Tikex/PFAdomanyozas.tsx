import React, { useState } from 'react'
import { fetchWithBaseUrl } from '../../../utils/api'
import { StartPaymentBackend } from '../../../tikexModule/Types/dto/startPayment'

export default function Shortcode({
	adSlug,
	price,
	planId,
	adSubPageId,
	teamSlug,
}: {
	adSlug: string
	price: string
	planId: string
	adSubPageId: string
	teamSlug: string
}) {
	const startPayment = () => {
		let startPaymentBackend: StartPaymentBackend = {
			redirectUrl: window.location.href,
			adSubPagesData: {
				[adSubPageId]: {
					planId,
					quantity: 1,
				},
			},
			adSlug,
			hasSubscribedToNewsletter: false,
			teamSlug,
		}

		fetchWithBaseUrl('startPayment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(startPaymentBackend),
		}).then(async (response) => {
			const data = await response.json()
			if (data.error) {
				alert(data.error)
			} else {
				window.location.href = data.GatewayUrl
			}
		})
	}

	return (
		<div
			style={{
				background: 'rgb(238, 238, 238)',
				border: '2px solid black',
				borderRadius: '0px',
				padding: '1vw',
				flexDirection: 'column',
				display: 'block',
			}}
		>
			<span
				style={{
					fontWeight: 600,
					fontSize: '30px',
					color: 'rgb(40, 40, 40)',
					display: 'block',
					marginBottom: '20px',
				}}
			>
				{price} Ft
			</span>
			<div
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<button
					id="pbpf-tamogatas-2"
					style={{
						border: 'none',
						borderRadius: '10px',
						background: 'rgb(40, 115, 24)',
						color: 'white',
						fontFamily: 'Arial',
						fontWeight: 400,
						letterSpacing: 'initial',
						lineHeight: '25px',
						height: '40px',
						cursor: 'pointer',
						width: 'max-content',
						minHeight: '40px',
						padding: '0px 1vw',
						fontSize: '20px',
						marginBottom: '20px',
					}}
					onClick={() => {
						startPayment()
					}}
				>
					TÁMOGATOM
				</button>
			</div>
		</div>
	)
}
