import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseURL } from '../../../utils/baseURL'

export default function Shortcode({
	env,
	teamId,
}: {
	env: string
	teamId: string
}) {
	const [programListHtml, setProgramListHtml] = useState<string>('')

	useEffect(() => {
		axios
			.get(baseURL(env) + 'programListHtml', {
				params: {
					teamId,
				},
			})
			.then((res: any) => {
				setProgramListHtml(res.data)
			})
			.catch((err) => console.error(err))
	}, [])

	return (
		<div
			dangerouslySetInnerHTML={{
				__html: programListHtml,
			}}
			style={{}}
		></div>
	)
}
