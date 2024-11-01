import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import AdminCalendar from '../../../tikexModule/components/AdminCalendar'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import DatePicker from 'react-datepicker'
import { EventTime } from '../../../tikexModule/Types/models/team'
import { formatISO, parseISO } from 'date-fns'
import SwitchBase from '../../../tikexModule/components/inputs/SwitchPass'
import randomString from '../../../tikexModule/utils/randomString'

export default function EventTimeEditorContent({
	children,
	buttonClassName = 'btn btn-sm full-width-sm',
}: {
	children?: React.ReactNode
	buttonClassName?: string
}) {
	const auth = useAuth()
	const [isModalOpened, setIsModalOpened] = useState<Boolean>(false)
	const [eventIdQuery, setEventIdQuery] = useState<string | undefined>(
		undefined
	)
	const [eventId, setEventId] = useState<string | undefined>(undefined)
	const [productId, setProductId] = useLocalStorage<string>(
		'productIdDashboard',
		''
	)
	const [eventTimeId, setEventTimeId] = useState<string | undefined>(undefined)
	// TODO: Rename teamIdDashboard to teamSlugDashboard
	const [teamSlug, setTeamSlug] = useLocalStorage<string>('teamIdDashboard', '')
	const team = useAuth().userDTO?.teams?.[teamSlug]
	const [formState, setFormState] = useState<Partial<EventTime>>({})

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const _eventId = urlParams.get('eventId')
		if (_eventId) {
			setEventIdQuery(_eventId)
			const _eventTimeId = urlParams.get('eventTimeId')
			if (_eventTimeId) {
				setEventTimeId(_eventTimeId)
				const eventTime = team?.ads[_eventId]?.eventTimes[_eventTimeId]
				if (eventTime) {
					setFormState(eventTime)
				}
			}
		}
	}, [team, eventIdQuery, eventTimeId])

	useEffect(() => {
		const url = new URL(window.location.href)
		const existingEventId = url.searchParams.get('eventId')
		if (isModalOpened && eventId && eventId != existingEventId) {
			url.searchParams.append('eventId', eventId)
			const existingEventTimeId = url.searchParams.get('eventTimeId')
			if (eventTimeId && existingEventTimeId != eventTimeId) {
				url.searchParams.append('eventTimeId', eventTimeId)
			}
			window.location.href = url.href
		}
	}, [isModalOpened, eventTimeId, eventId])

	if (auth.userDTO) {
		return (
			<div className="wrap">
				{!isModalOpened && !eventIdQuery && (
					<>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<h1>Időpontok</h1>
							<button
								className="button button-primary"
								onClick={() => {
									setEventTimeId(undefined)
									const url = new URL(window.location.href)
									if (productId) {
										url.searchParams.append('eventId', productId)
										window.location.href = url.href
									} else {
										setIsModalOpened(true)
									}
								}}
							>
								Új időpont
							</button>
						</div>
						<div>
							<p>
								Naptár oldalba beágyazható shortkódja, amiben a csapat összes
								időpontja megjelenik:{' '}
								<code>
									[tikex_calendar team_slug="{teamSlug} ad_slug="
									{productId}" "]
								</code>
							</p>
						</div>
						<br />
						<div style={{ padding: '0.5rem', backgroundColor: 'white' }}>
							<AdminCalendar
								setEventTimeId={setEventTimeId}
								eventTimeId={eventTimeId}
								setEventId={setEventId}
								eventId={eventId}
								teamSlug={teamSlug}
								isModalOpened={isModalOpened}
								setIsModalOpened={setIsModalOpened}
							/>
						</div>
					</>
				)}
				{(isModalOpened || eventIdQuery) && (
					<table className="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label>Program</label>
								</th>
								<td>
									<select
										onChange={(e) => {
											setEventIdQuery(e.target.value)
											/*const url = new URL(window.location.href)
											url.searchParams.append('eventId', e.target.value)
											window.location.href = url.href*/
										}}
										value={eventIdQuery ?? productId}
										className={'input-select'}
									>
										<option value="">- Válassz -</option>
										{Object.entries(team?.ads ?? {})
											.sort((a, b) => (a[0] > b[0] ? 1 : -1))
											.map(([k, v], i) => (
												<option value={k} key={k}>
													{v.name}
												</option>
											))}
									</select>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Kezdés</label>
								</th>
								<td>
									<DatePicker
										selected={
											formState?.startTime
												? parseISO(formState?.startTime)
												: undefined
										}
										onChange={(date: Date) => {
											if (!isNaN(date?.getTime())) {
												setFormState({
													...formState,
													startTime: formatISO(date),
												})
											}
										}}
										showTimeSelect
										dateFormat="Pp"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Befejezés</label>
								</th>
								<td>
									<DatePicker
										selected={
											formState?.endTime
												? parseISO(formState?.endTime)
												: undefined
										}
										onChange={(date: Date) => {
											if (!isNaN(date?.getTime())) {
												setFormState({
													...formState,
													endTime: formatISO(date),
												})
											}
										}}
										showTimeSelect
										dateFormat="Pp"
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
											setFormState({
												...formState,
												additionalInfo: e?.target?.value,
											})
										}}
										value={formState.additionalInfo}
										className="regular-text"
										type="text"
										placeholder="pl. salsa"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Más forrásból származó résztvevők száma</label>
								</th>
								<td>
									<input
										onChange={(e) => {
											let v = e?.target?.value
											let i = parseInt(v)
											if (i !== undefined) {
												setFormState({
													...formState,
													numOfParticipantsInOtherChannel: i,
												})
											}
										}}
										value={formState.numOfParticipantsInOtherChannel}
										className="regular-text"
										type="text"
										placeholder="pl. 12"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Értékesítés engedélyezése</label>
								</th>
								<td>
									<SwitchBase
										value={formState.enableSale ?? true}
										setValue={(newSwitchValue) => {
											setFormState({
												...formState,
												enableSale: newSwitchValue,
											})
										}}
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<button
										className="button button-primary"
										onClick={(e) => {
											const urlParams = new URLSearchParams(
												window.location.search
											)
											const _eventId = urlParams.get('eventId')
											if (_eventId) {
												const _eventTimeId = urlParams.get('eventTimeId')
												auth.updateClientAndServer({
													keyPath: [
														teamSlug,
														'products',
														_eventId,
														'eventTimes',
														_eventTimeId ?? randomString(4),
													],
													value: {
														...formState,
													},
													operation: 'setValue',
													completion: () => {
														const url = new URL(window.location.href)
														url.searchParams.delete('eventId')
														url.searchParams.delete('eventTimeId')
														window.location.href = url.href
														setIsModalOpened(false)
													},
												})
											}
										}}
									>
										Mentés
									</button>
								</th>
								<td></td>
							</tr>
							<tr>
								<th scope="row">
									<button
										className="button button-primary"
										onClick={(e) => {
											if (eventIdQuery && eventTimeId) {
												auth.updateClientAndServer({
													keyPath: [
														teamSlug,
														'products',
														eventIdQuery,
														'eventTimes',
														eventTimeId,
													],
													operation: 'removeKey',
													completion: () => {
														const url = new URL(window.location.href)
														url.searchParams.delete('eventId')
														url.searchParams.delete('eventTimeId')
														window.location.href = url.href
														setIsModalOpened(false)
													},
												})
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
										className="button button-primary"
										onClick={(e) => {
											const url = new URL(window.location.href)
											url.searchParams.delete('eventId')
											url.searchParams.delete('eventTimeId')
											window.location.href = url.href
											setIsModalOpened(false)
										}}
									>
										Vissza
									</button>
								</th>
								<td></td>
							</tr>
						</tbody>
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
