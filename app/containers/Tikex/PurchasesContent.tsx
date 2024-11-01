import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import { parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { hu } from 'date-fns/locale'
import { TicketWithPayment } from '../../../tikexModule/Types/dto/admin/ticket'
import { fetchWithBaseUrl } from '../../../utils/api'
import Switch from '../../../tikexModule/components/inputs/Switch'
import checkSoldTicketClient from '../../../tikexModule/lib/checkSoldTicketClient'

export default function TeamsContent({
	children,
}: {
	children?: React.ReactNode
}) {
	const auth = useAuth()

	// TODO: Rename to teamShortId
	const [teamId, setteamId] = useLocalStorage<string>('teamIdDashboard', '')
	const [eventId, setEventId] = useLocalStorage<string>(
		'productIdDashboard',
		''
	)
	const [isAllUnfinishedHidden, setIsAllUnfinishedHidden] = useState(true)
	const [selectedEventTimeId, setSelectedEventTimeId] = useLocalStorage<string>(
		'soldTicketSelectedEventTime',
		''
	)
	const organizations = useAuth().userDTO?.teams
	const organization = organizations?.[teamId]
	const pr = organization?.ads?.[eventId]

	const [ticketAdminDTO, setTicketAdminDTO] = useState<TicketWithPayment[]>([])

	useEffect(() => {
		if (teamId && eventId && auth.userDTO?.token) {
			fetchWithBaseUrl(`admin/${teamId}/ticketsAndPayments/${eventId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.userDTO?.token,
				},
			}).then(async (response) => {
				const data = await response.json()
				setTicketAdminDTO(data)
			})
		}
	}, [eventId, teamId, auth.userDTO?.token])

	if (auth.userDTO) {
		return (
			<div className="wrap">
				<table className="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label>Esemény</label>
							</th>
							<td>
								<select
									onChange={(e) => {
										let v = e?.target?.value
										setEventId(v)
									}}
									value={eventId}
								>
									<option value="">Nincs termék</option>
									{Object.entries(organization?.ads ?? {})
										.sort((a, b) => a[1].name.localeCompare(b[1].name))
										.map(([k, v]) => (
											<option key={k} value={k}>
												{v.name}
											</option>
										))}
								</select>
							</td>
						</tr>
						{eventId && (
							<tr>
								<th scope="row">
									<label>Időpont</label>
								</th>
								<td>
									<select
										value={selectedEventTimeId}
										onChange={(e) => {
											let v = e?.target?.value
											setSelectedEventTimeId(v)
										}}
									>
										<option value="">- Válassz -</option>
										{Object.entries(pr?.eventTimes ?? {})
											.sort(
												(a, b) =>
													parseISO(a[1].startTime).getTime() -
													parseISO(b[1].startTime).getTime()
											)
											.map(([k, v]) => (
												<option key={k} value={k}>
													{formatInTimeZone(
														parseISO(v.startTime),
														'Europe/Budapest',
														'y MMMM dd (EEEE) HH:mm',
														{
															locale: hu,
														}
													)}
													{v.additionalInfo}
												</option>
											))}
									</select>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				{eventId && (
					<table className="wp-list-table widefat fixed striped table-view-list users">
						<thead>
							<tr>
								<th scope="col" id="name" className="manage-column column-name">
									Név
								</th>
								<th scope="col" id="name" className="manage-column column-name">
									ID
								</th>
								<th scope="col" id="name" className="manage-column column-name">
									Bérlet
								</th>
								<td
									id="cb"
									className="manage-column column-cb check-column"
								></td>
							</tr>
						</thead>
						<tbody id="the-list" data-wp-lists="list:user"></tbody>
					</table>
				)}
			</div>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}

/**
{Object.entries(ticketAdminDTO?.tickets ?? {})
								.filter(([k, v]) =>
									isAllUnfinishedHidden ? v?.validatedAt || v?.indOfPass : true
								)
								.filter(([k, v]) =>
									selectedEventTimeId
										? v?.eventTimeId === selectedEventTimeId
										: true
								)
								.sort((a, b) =>
									(
										ticketAdminDTO?.payments[a[0]]?.userName ??
										ticketAdminDTO?.payments[a[0]]?.partnerData?.name ??
										''
									).localeCompare(
										ticketAdminDTO?.payments[b[0]]?.userName ??
											ticketAdminDTO?.payments[b[0]]?.partnerData?.name ??
											''
									)
								)
								.map(([k, v]) => {
									return (
										<tr key={k}>
											<td>
												{ticketAdminDTO?.payments[v.paymentId!.toString()]
													?.userName ??
													ticketAdminDTO?.payments[v.paymentId!.toString()]
														?.partnerData?.name}
											</td>
											<td>{v?.publicId}</td>
											{Object.keys(pr?.passTypeIds ?? {}).length > 0 && (
												<td>
													{v?.indOfPass
														? v?.indOfPass + '/' + v?.capacityOfPass
														: ''}
													<br />
													
												</td>
											)}
											<td>
												<Switch
													checkedPrio={v?.checkedInAt != undefined}
													onChangePrio={(e) => {
														const transactionId = k
														const body = {
															ticketId: k,
															checkedInWith: 'switch',
															removeChecking: v?.checkedInAt != undefined,
														}
														checkSoldTicketClient(
															transactionId,
															ticketAdminDTO!,
															setTicketAdminDTO
														)
														fetchWithBaseUrl(`checkTicket`, {
															method: 'POST',
															headers: {
																'Content-Type': 'application/json',
																Authorization: 'Bearer ' + auth.userDTO?.token,
															},
															body: JSON.stringify(body),
														})
													}}
												/>
											</td>
										</tr>
									)
								})}

 */
