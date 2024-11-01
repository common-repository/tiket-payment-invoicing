import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { baseURL } from '../../../utils/baseURL'

export default function PremiumContent({
	env,
	programId,
	teamId,
}: {
	env: string
	programId: string
	teamId: string
}) {
	const [premiumContentId, setPremiumContentId] = useState<string | undefined>(
		undefined
	)

	useEffect(() => {
		axios
			.get(baseURL(env) + 'premiumContentUrl', {
				params: {
					programId,
					teamId,
				},
			})
			.then((res: any) => {
				setPremiumContentId(res.data)
			})
			.catch((err) => console.error(err))
	}, [])

	return (
		<>
			{premiumContentId && (
				<video controls>
					<source
						src={`https://ticket-t01.s3.eu-central-1.amazonaws.com/${premiumContentId}`}
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			)}
		</>
	)
}
