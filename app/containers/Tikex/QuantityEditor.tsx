import React, { useState, useEffect } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import { StartPaymentFrontend } from '../../../tikexModule/Types/dto/startPayment'
import useLocalStorageTX2 from '../../../tikexModule/hooks/useLocalStorageTX2'

export default function QuantityEditor(props: {
	programId: string
	invoiceItemId?: string
	formFieldId?: string
}) {
	let { programId, invoiceItemId, formFieldId } = props
	const [startPaymentFrontend, setStartPaymentFrontend] =
		useLocalStorageTX2<StartPaymentFrontend>('startPaymentFrontend.v4', {
			adSubPagesData: {},
			formFieldData: {},
			partnerData: { country: 'Magyarország' },
		})
	return (
		<input
		/*value={
				invoiceItemId
					? startPaymentFrontend?.products[programId]?.invoiceItems?.[
							invoiceItemId
					  ]
					: formFieldId
					? startPaymentFrontend?.products[programId]?.formFields?.[formFieldId]
					: ''
			}
			onChange={(e) => {
				if (invoiceItemId) {
					let i = parseInt(e.target.value)
					if (isNaN(i)) {
						i = 0
					}
					let startPaymentIn2 = {
						...startPaymentFrontend?.products[programId]!,
					}
					let invoiceItems = startPaymentIn2?.['invoiceItems'] ?? {}
					invoiceItems[invoiceItemId] = i
					startPaymentIn2['invoiceItems'] = invoiceItems
					setStartPaymentFrontend({
						...startPaymentFrontend,
						[programId]: startPaymentIn2,
					})
					//dispatchEvent(new CustomEvent('recalculatePrice', {}))
				}
			}}*/
		/>
	)
}
