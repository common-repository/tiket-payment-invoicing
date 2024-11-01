import React from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import {
	Currency,
	InvoiceProvider,
	Locale,
} from '../../../tikexModule/Types/dto/team'
import Input from '../../../tikexModule/components/inputs/Input'
import Select from '../../../tikexModule/components/inputs/Select'
import { useAuth } from '../../../tikexModule/hooks/useAuth'

export default function TeamsContent({
	children,
}: {
	children?: React.ReactNode
}) {
	const auth = useAuth()
	const organizations = auth?.userDTO?.teams
	const [selectedTeamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)
	const organization = organizations?.[selectedTeamId]
	const [eventId, setEventId] = useLocalStorage<string>(
		'productIdDashboard',
		Object.keys(organization?.ads ?? {})[0]
	)
	const [productId, setProductId] = useLocalStorage<string>(
		'productIdDashboard',
		''
	)

	if (auth.userDTO) {
		return (
			<>
				<div className="container">
					<table className="form-table" role="presentation">
						<tbody>
							{Object.keys(organizations ?? {}).length > 1 && (
								<tr>
									<th scope="row">
										<label>Team</label>
									</th>
									<td>
										<select
											value={selectedTeamId}
											onChange={(
												event: React.ChangeEvent<HTMLSelectElement>
											) => {
												setSelectedTeamId(event.target.value)
												setProductId('')
											}}
											className={'input-select'}
											style={{ margin: '0' }}
										>
											{Object.entries(organizations ?? {})
												.sort((a, b) => a[1]?.name!.localeCompare(b[1]?.name!))
												.map(([key, value]) => (
													<option key={key} value={key}>
														{value.name}
													</option>
												))}
										</select>
									</td>
								</tr>
							)}
							<tr>
								<th scope="row">
									<label>
										Szervező neve <span style={{ color: 'red' }}>*</span>
									</label>
								</th>
								<td>
									<Input
										keyPath={[selectedTeamId, 'name']}
										placeholder="pl. Apple"
										disabled={organization?.isLocked}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>
										Telefonszám <span style={{ color: 'red' }}>*</span>
									</label>
								</th>
								<td>
									<Input
										keyPath={[selectedTeamId, 'phone']}
										disabled={organization?.isLocked}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>

							<tr>
								<th scope="row">
									<label>Számlázási szolgáltató </label>
								</th>
								<td>
									<Select
										keyPath={[selectedTeamId, 'selectedInvoiceProvider']}
										disabled={organization?.isLocked}
									>
										{Object.entries(InvoiceProvider).map(([key, value]) => (
											<option value={value} key={key}>
												{value}
											</option>
										))}
									</Select>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Email</label>
								</th>
								<td>
									<Input
										keyPath={[selectedTeamId, 'email']}
										placeholder="Email"
										disabled={organization?.isLocked}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Pénznem</label>
								</th>
								<td>
									<Select
										keyPath={[selectedTeamId, 'currency']}
										disabled={organization?.isLocked}
									>
										{Object.entries(Currency).map(([key, value]) => (
											<option value={value} key={key}>
												{value}
											</option>
										))}
									</Select>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Nyelv</label>
								</th>
								<td>
									<Select
										keyPath={[selectedTeamId, 'locale']}
										disabled={organization?.isLocked}
									>
										{Object.entries(Locale).map(([key, value]) => (
											<option value={value} key={key}>
												{value}
											</option>
										))}
									</Select>
								</td>
							</tr>
							{false && (
								<a
									className="btn btn-circle btn-sm"
									style={{ marginBottom: '30px' }}
									href={`https://api.tikex.com/organizationPayments?teamId=${selectedTeamId}`}
									download="user-database.json"
								>
									Download User Database
								</a>
							)}
						</tbody>
					</table>
				</div>
			</>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}
