import React, { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import { PassType } from '../../../tikexModule/Types/dto/team'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import randomString from '../../../tikexModule/utils/randomString'

export default function PassesEditorContent({
	children,
}: {
	children?: React.ReactNode
}) {
	const auth = useAuth()
	const [teamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)
	const [passTypeIdToEdit, setPassTypeIdToEdit] = useState<string | null>(null)
	const [passTypeIdToShow, setPassTypeIdToShow] = useState<string | null>(null)
	const [isPassTypeEditSectionOpen, setIsPassTypeEditSectionOpen] =
		useState<boolean>(false)
	const [isPassEditSectionOpen, setIsPassEditSectionOpen] =
		useState<boolean>(false)
	const [isTicketEditingSectionOpen, setIsTicketEditingSectionOpen] =
		useState<boolean>(false)

	const [passId, setPassId] = useState<string | null>(null)
	const [eventTimeId, setEventTimeId] = useState<string>('')
	//const [soldPassesRes, setSoldPassesRes] = useState<SoldPassesRes>()
	const [ticketId, setTicketId] = useState<string | null>()
	//const pass = passId ? soldPassesRes?.payments?.[passId] : undefined
	const organization = auth.userDTO?.teams?.[teamId]

	const handleUpsertPassType = (e: any) => {
		const id = passTypeIdToEdit ?? randomString(4)

		auth.updateClientAndServer({
			keyPath: [teamId, 'passTypes', id],
			value: {
				price: passTypeFormState?.price,
				capacity: passTypeFormState?.capacity,
				expirationDays: passTypeFormState?.expirationDays,
				invoiceDescription: passTypeFormState?.invoiceDescription,
				additionalInfo: passTypeFormState?.additionalInfo,
			},
			operation: 'setValue',
		})
	}

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const _passTypeIdToEdit = urlParams.get('passTypeIdToEdit')
		setPassTypeIdToEdit(_passTypeIdToEdit)
		const _passTypeIdToShow = urlParams.get('passTypeIdToShow')
		setPassTypeIdToShow(_passTypeIdToShow)
		const _passId = urlParams.get('passId')
		setPassId(_passId)
		const _isTicketEditingSectionOpen = urlParams.get(
			'isTicketEditingSectionOpen'
		)
		setIsTicketEditingSectionOpen(_isTicketEditingSectionOpen != undefined)
		const _ticketId = urlParams.get('ticketId')
		setTicketId(_ticketId)
	}, [])

	/*useEffect(() => {
		if (passId && ticketId && soldPassesRes) {
			const payment = soldPassesRes?.payments?.[passId]
			if (payment) {
				const t = payment.tickets?.filter((t) => t.id == ticketId)[0]
				const _eventTimeId = t.eventTimeId
				setEventTimeId(_eventTimeId)
			}
		}
	}, [passId, ticketId, soldPassesRes])*/

	/*useEffect(() => {
		if (teamId && passTypeIdToShow) {
			getSoldPasses(
				{
					teamId: teamId as string,
					passTypeId: passTypeIdToShow as string,
				},
				auth.userDTO!.token!
			).then((res) => {
				setSoldPassesRes(res.data)
			})
		}
	}, [teamId, passTypeIdToShow])*/

	const [passTypeFormState, setPassTypeFormState] = useState<Partial<PassType>>(
		{
			capacity: 7,
			expirationDays: 28,
		}
	)

	useEffect(() => {
		if (teamId && passTypeIdToEdit) {
			const passtype = organization?.passTypes?.[passTypeIdToEdit]
			if (passtype) {
				setPassTypeFormState(passtype)
			}
		}
	}, [teamId, passTypeIdToEdit])

	if (auth.userDTO) {
		return (
			<div className="wrap">
				{!passTypeIdToShow && !passTypeIdToEdit && (
					<>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<h1>Bérlet típusok</h1>
							<button
								className="button button-primary"
								onClick={() => setIsPassTypeEditSectionOpen(true)}
							>
								Új bérlet típus
							</button>
						</div>
						<br />
						<table className="wp-list-table widefat fixed striped table-view-list users">
							<thead>
								<tr>
									<th>Ár</th>
									<th>Kapacitás</th>
									<th>Lejárat</th>
									<th>Megjegyzés</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(organization?.passTypes ?? {})
									.sort((a, b) => a[1]?.price?.localeCompare(b[1]?.price))
									.map(([k, v]) => (
										<tr key={k}>
											<td>{v.price}</td>
											<td>{v.capacity}</td>
											<td>{v.expirationDays}</td>
											<td>{v.additionalInfo}</td>
											<td>
												<div
													style={{
														display: 'flex',
														justifyContent: 'flex-end',
													}}
												>
													<button
														className={`button button-primary`}
														onClick={() => {
															//setPassTypeIdToEdit(k)
															const url = new URL(window.location.href)
															url.searchParams.append('passTypeIdToEdit', k)
															window.location.href = url.href
														}}
														style={{ marginRight: '1rem' }}
													>
														Szerkeszt
													</button>
													<button
														className={`button button-primary`}
														onClick={() => {
															const url = new URL(window.location.href)
															url.searchParams.append('passTypeIdToShow', k)
															window.location.href = url.href
														}}
													>
														Részletek
													</button>
												</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</>
				)}
				{passTypeIdToEdit && (
					<table className="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label>Bérlet ára</label>
								</th>
								<td>
									<input
										onChange={(e) => {
											let v = e?.target?.value
											setPassTypeFormState({ ...passTypeFormState, price: v })
										}}
										value={passTypeFormState.price}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Bérlet kapacitása</label>
								</th>
								<td>
									<input
										onChange={(e) => {
											let v = e?.target?.value
											let i = parseInt(v)
											if (i !== undefined) {
												setPassTypeFormState({
													...passTypeFormState,
													capacity: i,
												})
											}
										}}
										value={passTypeFormState.capacity}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Lejárat</label>
								</th>
								<td>
									<input
										onChange={(e) => {
											let v = e?.target?.value
											let i = parseInt(v)
											if (i !== undefined) {
												setPassTypeFormState({
													...passTypeFormState,
													expirationDays: i,
												})
											}
										}}
										value={passTypeFormState.expirationDays}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Számla leírása</label>
								</th>
								<td>
									<input
										onChange={(e) => {
											let v = e?.target?.value
											setPassTypeFormState({
												...passTypeFormState,
												invoiceDescription: v,
											})
										}}
										value={passTypeFormState.invoiceDescription}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Kiegészítő információ</label>
								</th>
								<td>
									<input
										onChange={(e) => {
											let v = e?.target?.value
											setPassTypeFormState({
												...passTypeFormState,
												additionalInfo: v,
											})
										}}
										value={passTypeFormState.additionalInfo}
										className="regular-text"
										type="text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<button
										className="button button-primary"
										onClick={(e) => {
											handleUpsertPassType(e)
											setPassTypeIdToEdit(null)
											setIsPassTypeEditSectionOpen(false)
										}}
									>
										Mentés
									</button>
								</th>
								<td></td>
							</tr>
						</tbody>
					</table>
				)}
				{passTypeIdToShow && !passId && (
					<>
						<br />
						<h1>Bérletek</h1>
						<br />
						<table className="wp-list-table widefat fixed striped table-view-list users">
							<thead>
								<tr>
									<th>Felhasználónév</th>
									<th>Alkalmak</th>
									<th>Vásárlás</th>
									<th>Lejárat</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{/*Object.entries(soldPassesRes?.payments ?? {})
									.filter(
										([key, value]) =>
											new Date().getTime() -
												new Date(value?.validatedAt).getTime() <=
											1000 * 60 * 60 * 24 * 80
									)
									.sort((a, b) => a[1]?.userName?.localeCompare(b[1]?.userName))
									.map(([k, v]) => (
										<tr key={k}>
											<td>{v.userName}</td>
											<td>
												{v.lastIndOfPass}/{v.capacityOfPass}
											</td>
											<td>
												{formatInTimeZone(
													parseISO(v.validatedAt),
													'Europe/Budapest',
													'yyyy. MM. dd.'
												)}
											</td>
											<td>
												{formatInTimeZone(
													parseISO(v.expiresAt ?? ''),
													'Europe/Budapest',
													'yyyy. MM. dd.'
												)}
											</td>
											<td>
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'flex-end',
														gap: '0.5rem',
													}}
												>
													<button
														className={`button button-primary`}
														onClick={() => {
															const url = new URL(window.location.href)
															url.searchParams.append('passId', k)
															window.location.href = url.href
														}}
													>
														Részletek
													</button>
												</div>
											</td>
										</tr>
													))*/}
							</tbody>
						</table>
					</>
				)}
				{passId && !isTicketEditingSectionOpen && (
					<>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<h1>Beváltott alkalmak - {/*pass?.userName*/}</h1>
							<button
								className="button button-primary"
								style={{
									marginTop: '1rem',
									marginBottom: '1rem',
								}}
								onClick={async () => {
									const url = new URL(window.location.href)
									url.searchParams.append('isTicketEditingSectionOpen', 'true')
									window.location.href = url.href
									/*const pass = soldPassesRes?.payments?.[passId]
									const eventTime = soldPassesRes?.programEventTimes[0]
									if (eventTime) {
										const res = await redeemOrChangePassTicketManually(
											{
												teamId,
												paymentId: passId,
												eventTimeId: eventTime?.eventTimeId,
												startTime: eventTime?.startTime,
												programId: eventTime?.programId,
												programName: eventTime?.programName,
												email: pass?.email,
												userId: pass?.userId,
												userName: pass?.userName,
											},
											auth.userDTO!.token!
										)
										setSoldPassesRes(res.data)
									} else {
										alert('No eventTime found')
									}*/
								}}
							>
								Beváltás
							</button>
						</div>
						<table className="form-table" role="presentation">
							<tbody>
								{/*pass?.tickets.map((t, index) => (
									<tr>
										<th scope="row">
											<label>
												{t.programId} -{' '}
												{formatInTimeZone(
													parseISO(t.startTime),
													'Europe/Budapest',
													'yyyy. MM. dd. HH:mm'
												)}
											</label>
										</th>
										<td>
											<button
												className={`button button-primary`}
												onClick={() => {
													const url = new URL(window.location.href)
													url.searchParams.append(
														'isTicketEditingSectionOpen',
														'true'
													)
													url.searchParams.append('ticketId', t.id)
													window.location.href = url.href
												}}
											>
												Módosít
											</button>
										</td>
									</tr>
											))*/}
							</tbody>
						</table>
					</>
				)}
				{isTicketEditingSectionOpen && passId && (
					<>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							{ticketId ? (
								<h1>Bérlet alkalom módosítása</h1>
							) : (
								<h1>Új bérlet alkalom hozzáadása</h1>
							)}
							<button
								className={`button button-primary`}
								onClick={async () => {
									/*const pass = soldPassesRes?.payments?.[passId]
									const eventTime = soldPassesRes?.programEventTimes.filter(
										(x) => x.eventTimeId == eventTimeId
									)[0]
									const res = await redeemOrChangePassTicketManually(
										{
											teamId,
											paymentId: passId,
											eventTimeId: eventTimeId,
											startTime: eventTime?.startTime,
											transactionId: ticketId,
											programId: eventTime?.programId,
											programName: eventTime?.programName,
											email: pass?.email,
											userId: pass?.userId,
											userName: pass?.userName,
										},
										auth.userDTO!.token!
									)
									setSoldPassesRes(res.data)
									window.history.back()*/
								}}
							>
								Mentés
							</button>
						</div>
						<table className="form-table" role="presentation">
							<tbody>
								<tr>
									<th scope="row">
										<select
											onChange={async (
												e: React.FocusEvent<HTMLSelectElement>
											) => {
												setEventTimeId(e.target.value)
											}}
											className="input-select"
											value={eventTimeId}
										>
											{/*soldPassesRes?.programEventTimes.map((i, index) => (
												<option key={index} value={i.eventTimeId}>
													{i.programId} - {i.additionalInfo ?? 'n/a'} -{' '}
													{formatInTimeZone(
														parseISO(i.startTime),
														'Europe/Budapest',
														'yyyy. MM. dd. HH:mm'
													)}
												</option>
													))*/}
										</select>
									</th>
									<td></td>
								</tr>
								<tr>
									<th scope="row">
										<button
											className={`button button-primary`}
											onClick={() => {
												if (
													window.confirm(
														'Are you sure you want to delete this item?'
													)
												) {
													/*cancelPassTicketManually(
														{
															teamId,
															paymentId: passId,
															transactionId: ticketId,
														},
														auth.userDTO!.token!
													).then((res) => {
														setSoldPassesRes(res.data)
													})*/
												}
											}}
										>
											Törlés
										</button>
									</th>
									<td></td>
								</tr>
								<tr>
									<th scope="row">
										<button
											className={`button button-primary`}
											onClick={() => {
												window.history.back()
											}}
										>
											Vissza
										</button>
									</th>
									<td></td>
								</tr>
							</tbody>
						</table>
					</>
				)}
			</div>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}
