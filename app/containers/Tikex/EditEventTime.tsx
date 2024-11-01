import { formatISO, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { EventTime } from '../../../tikexModule/Types/models/team'
import Input from '../../../tikexModule/components/inputs/Input'
import Switch from '../../../tikexModule/components/inputs/Switch'
import DatePicker from 'react-datepicker'
//import 'react-datepicker/dist/react-datepicker.css'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import { v4 as uuid } from 'uuid'

interface FormState extends Partial<EventTime> {}
const EditEventTime = ({
	teamId,
	eventId,
	eventTimeId,
	completion,
}: {
	teamId: string
	eventId?: string
	eventTimeId?: string
	[key: string]: any
	completion: Function
}) => {
	const o = useAuth().userDTO?.teams?.[teamId]
	const auth = useAuth()
	const [_eventId, setEventId] = useState<string | undefined>(eventId)
	const [_eventTimeId, setEventTimeId] = useState<string>(eventTimeId ?? uuid())
	const [formState, setFormState] = useState<FormState>({
		enableSale: true,
	})

	useEffect(() => {
		if (eventId && eventTimeId) {
			//const event = o?.products?.[eventId]
			const eventTime = o?.ads?.[eventId]?.eventTimes?.[eventTimeId]
			if (eventTime) {
				setFormState(eventTime)
			}
		}
	}, [eventId, eventTimeId])

	const handleSubmit = (e: any) => {
		if (_eventId && _eventTimeId) {
			auth.updateClientAndServer({
				keyPath: [teamId, 'products', _eventId, 'eventTimes', _eventTimeId],
				value: {
					...formState,
				},
				operation: 'setValue',
				completion: () => {
					completion()
				},
			})

			/*if (auth.userDTO?.fbId && event?.facebookEventId) {
				// '2023-04-01T19:00:00-0700'
				const newEventTime = {
					start_time: formState.startTime,
					end_time: formState.endTime,
				}
				window.FB.post(
					`/${event?.facebookEventId}`,
					newEventTime,
					(err: Error, res: { id: string }) => {
						if (err) {
							console.error(err)
							return
						}
						console.log('Event time added to event: ' + res.id)
					}
				)
			}*/
		}
	}

	const handleRemove = (e: any) => {
		if (eventTimeId && eventId) {
			auth.updateClientAndServer({
				keyPath: [teamId, 'products', eventId, 'eventTimes', eventTimeId],
				operation: 'removeKey',
				completion: () => {
					completion()
				},
			})
		}
	}

	return (
		<>
			<h1>Időpont hozzáadása</h1>
			<table className="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row">
							<label htmlFor="blogname">Program</label>
						</th>
						<td>
							<select
								onChange={(e) => {
									setEventId(e.target.value)
								}}
								value={_eventId}
								className={'input-text'}
								disabled={eventId != undefined}
							>
								<option value="">- Válassz -</option>
								{Object.entries(o?.ads ?? {})
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
							<label htmlFor="blogname">Kezdés</label>
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
											['startTime']: formatISO(date),
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
							<label htmlFor="blogname">Befejezés</label>
						</th>
						<td>
							<DatePicker
								selected={
									formState?.endTime ? parseISO(formState?.endTime) : undefined
								}
								onChange={(date: Date) => {
									if (!isNaN(date?.getTime())) {
										setFormState({
											...formState,
											['endTime']: formatISO(date),
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
							<label htmlFor="blogname">Kiegészítő információ</label>
						</th>
						<td>
							<Input
								formState={formState}
								setFormState={setFormState}
								name="additionalInfo"
								placeholder="pl. 12"
								teamId={teamId}
								className={'regular-text'}
								type="text"
							/>
						</td>
					</tr>
					<tr>
						<th scope="row">
							<label htmlFor="blogname">
								Más forrásból származó résztvevők száma
							</label>
						</th>
						<td>
							<Input
								formState={formState}
								setFormState={setFormState}
								name="numOfParticipantsInOtherChannel"
								placeholder="pl. 12"
								teamId={teamId}
								className={'regular-text'}
								type="text"
							/>
						</td>
					</tr>
					<tr>
						<th scope="row">Értékesítés engedélyezése</th>
						<td>
							<fieldset>
								<legend className="screen-reader-text">
									<span>Értékesítés engedélyezése</span>
								</legend>
								<label htmlFor="users_can_register">
									<Switch
										formState={formState}
										setFormState={setFormState}
										name="enableSale"
										teamId={teamId}
									/>
								</label>
							</fieldset>
						</td>
					</tr>
				</tbody>
			</table>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '1rem',
						flexDirection: 'column',
						textAlign: 'center',
					}}
				>
					<input
						type="submit"
						className="button button-primary"
						value="Delete"
						onClick={handleRemove}
					/>
					<input
						type="submit"
						className="button button-primary"
						value="Save Changes"
						onClick={handleSubmit}
					/>
					<input
						type="submit"
						className="button button-primary"
						value="Back"
						onClick={() => {
							completion()
						}}
					/>
				</div>
			</div>
		</>
	)
}

export default EditEventTime
