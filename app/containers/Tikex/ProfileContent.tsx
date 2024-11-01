import React from 'react'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'

export default function TeamsContent({
	children,
}: {
	children?: React.ReactNode
}) {
	const auth = useAuth()

	const [teamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)

	const shortenString = (str: string) => {
		if (str?.length > 30) {
			return str.substring(0, 27) + '...'
		} else {
			return str
		}
	}

	if (auth.userDTO) {
		return (
			<div className="wrap">
				<table className="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label htmlFor="blogname">User ID</label>
							</th>
							<td>
								<p className="description" id="tagline-description">
									{auth?.userDTO?.userId?.toLowerCase()}
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label htmlFor="blogname">Name</label>
							</th>
							<td>
								<p className="description" id="tagline-description">
									{auth?.userDTO?.userName}
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label htmlFor="blogname">E-mail</label>
							</th>
							<td>
								<p className="description" id="tagline-description">
									{auth?.userDTO?.email}
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}
