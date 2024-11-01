import React, { useEffect, useRef, useState } from 'react'
import { DateRangeInput, EventApi, EventInput } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { fetchWithBaseUrl } from '../../../utils/api'
import { StartPaymentFrontend } from '../../../tikexModule/Types/dto/startPayment'
import useLocalStorageTX2 from '../../../tikexModule/hooks/useLocalStorageTX2'
import { UserProductDTOFields } from '../../../tikexModule/Types/dto/user/product'
import { convertUserAdToEventInputs } from '../../../tikexModule/utils/convertUserAdToEventInputs'
import ShoppingCart from '../../../tikexModule/components/ShoppingCart'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import randomString from '../../../tikexModule/utils/randomString'
import { isDateHitBooking } from '../../../tikexModule/utils/isDateHitBooking'
import { CalendarApi } from '@fullcalendar/core'
import DatePicker from 'react-datepicker'
import Checkmark from '../../../tikexModule/components/Checkmark'

export default function UserCalendar({
	teamSlug,
	adSlug,
}: {
	teamSlug: string
	adSlug: string
}) {
	const [data, setData] = useState<UserProductDTOFields | undefined>(undefined)
	const [teamSlugUser, setTeamSlugUser] = useLocalStorageTX2<string>(
		'teamSlugUser',
		teamSlug,
		true
	)
	const [adSlugUser, setAdSlugUser] = useLocalStorageTX2<string | undefined>(
		'productSlugUser',
		undefined
	)
	const [adSubPageFilterIds, setAdSubPageFilterIds] = useLocalStorageTX2<
		string[]
	>('productSlugsUser.v4', [])

	const [startPaymentFrontend, setStartPaymentFrontend] =
		useLocalStorageTX2<StartPaymentFrontend>('startPaymentFrontend.v4', {
			adSubPagesData: {},
			formFieldData: {},
			partnerData: { country: 'Magyarország' },
		})
	const [isCheckoutVisible, setIsCheckoutVisible] = useState<Boolean>(false)
	const auth = useAuth()
	const [initialView, setInitialView] = useState('timeGridThreeDay')
	const [isShortCalendar, setIsShortCalendar] = useState<string>('1')
	const [isLoginVisible, setIsLoginVisible] = useState<Boolean>(false)
	const calendarRef = useRef<FullCalendar>(null)
	const [isOnlyBasketVisible, setIsOnlyBasketVisible] = useState<Boolean>(false)
	const [isOnlyUserBookingVisible, setIsOnlyUserBookingVisible] =
		useState<Boolean>(false)
	const pathname = window.location.pathname
	const pathSegments = pathname.split('/').filter((segment) => segment) // Split and filter out empty segments
	const penultimateElement = pathSegments[pathSegments.length - 2]
	const [selectedEventTimeId, setSelectedEventTimeId] = useState<
		string | undefined
	>(undefined)
	const [selectedAdSubPageId, setSelectedAdSubPageId] = useState<
		string | undefined
	>(undefined)
	const [selectedStartTime, setSelectedStartTime] = useState<Date | undefined>(
		undefined
	)
	const [selectedEndTime, setSelectedEndTime] = useState<Date | undefined>(
		undefined
	)
	const [adSubPageId, setAdSubPageId] = useLocalStorageTX2<string>(
		'adSubPageId.v4',
		''
	)
	const [planId, setPlanId] = useLocalStorageTX2<string>('planId', '')

	useEffect(() => {
		if (adSlug) {
			fetchWithBaseUrl(`user/product?teamSlug=${teamSlug}&adSlug=${adSlug}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(async (response) => {
				const _data = await response.json()
				setData(_data)
				const keys = Object.keys(_data.adSubPages ?? {})
				if (keys.length > 0) {
					setAdSubPageId(keys[0])
					setAdSubPageFilterIds(keys)
				}
			})
			setAdSlugUser(adSlug)
		}
	}, [adSlug])

	useEffect(() => {
		if (startPaymentFrontend?.adSubPagesData && adSubPageId) {
			const startPaymentProduct =
				startPaymentFrontend?.adSubPagesData[adSubPageId]
			if (startPaymentProduct) {
				setPlanId(startPaymentProduct.planId)
			}
		}
	}, [startPaymentFrontend])

	let eventInputs = isOnlyBasketVisible
		? []
		: convertUserAdToEventInputs(
				auth.userDTO,
				teamSlugUser,
				data,
				adSubPageFilterIds,
				isOnlyUserBookingVisible
		  )
	const additionalEventTimes = isOnlyUserBookingVisible
		? []
		: Object.entries(startPaymentFrontend?.adSubPagesData ?? {}).flatMap(
				([adSubPageId, adSubPageData]) => {
					return Object.entries(adSubPageData.eventTimes ?? {}).map(
						([key3, value3]) => {
							return {
								isBasket: true,
								id: key3,
								title: isOnlyBasketVisible
									? `${data?.adSubPages?.[adSubPageId].name} - ${Object.entries(
											data?.adSubPages?.[adSubPageId].plans?.[
												adSubPageData.planId
											]?.paymentRecipients ?? {}
									  )?.reduce((acc, [_, recipient]) => {
											// Reduce over the recipient's products
											const recipientTotal = Object.entries(
												recipient.products ?? {}
											).reduce((productAcc, [_, product]) => {
												// Accumulate the unitPrice for each product
												return (
													productAcc + (parseInt(product.unitPrice ?? '0') || 0)
												) // Add unitPrice or 0 if it's undefined
											}, 0)

											// Add the recipient's total to the main accumulator
											return acc + recipientTotal
									  }, 0)} Forint / óra`
									: 'kosárban',
								start: value3.startTime,
								end: value3.endTime,
								editable: true,
								extendedProps: {
									adSubPageId,
									eventTimeId: key3,
								},
								color: data?.adSubPages?.[adSubPageId]?.colorCode,
								textColor: 'blue',
							}
						}
					)
				}
		  )

	eventInputs = [...additionalEventTimes, ...eventInputs]

	useEffect(() => {
		if (eventInputs) {
			console.log(eventInputs)
		}
	}, [eventInputs])

	// Update the useEffect that listens to isCheckoutVisible changes
	useEffect(() => {
		const calendarApi: CalendarApi | undefined = calendarRef.current?.getApi()
		if (calendarApi) {
			calendarApi.changeView(
				isCheckoutVisible
					? 'listMonth'
					: window.innerWidth > 768
					? 'timeGridWeek'
					: 'timeGridDay'
			)
		}
		if (isCheckoutVisible) {
			setIsOnlyBasketVisible(true)
		}
	}, [isCheckoutVisible])

	const modalSaveDisabled =
		adSubPageId != null &&
		planId != null &&
		startPaymentFrontend != undefined &&
		selectedEventTimeId != undefined &&
		selectedStartTime != undefined &&
		selectedEndTime != undefined &&
		data != undefined &&
		startPaymentFrontend &&
		(selectedStartTime > selectedEndTime ||
			selectedEndTime < new Date() ||
			isDateHitBooking(
				selectedStartTime,
				selectedEndTime,
				eventInputs.filter((eventInput) => {
					return eventInput.id !== selectedEventTimeId
				})
			) == true ||
			selectedStartTime.getHours() <
				(data?.adSubPages?.[adSubPageId]?.plans[planId]?.businessHoursStart ??
					data.businessHoursStart ??
					0) ||
			selectedEndTime.getHours() >
				(data?.adSubPages?.[adSubPageId]?.plans[planId]?.businessHoursEnd ??
					data?.businessHoursEnd ??
					24))
	console.log('modalSaveDisabled', modalSaveDisabled)

	return (
		<div>
			<div
				style={{
					justifyContent: 'space-between',
					gap: '16px',
				}}
				className="flex-responsive align-items-responsive"
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexWrap: 'wrap',
						gap: '16px',
					}}
				>
					{adSubPageFilterIds &&
						Object.entries(data?.adSubPages ?? {})
							.sort((a, b) => (a[0] > b[0] ? 1 : -1))
							.map(([adSubPageId, adSubPage]) => (
								<button
									key={adSubPageId}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										backgroundColor: 'white',
										borderColor: '#ddd',
										padding: '10px 10px',
										borderRadius: '3px',
										borderStyle: 'solid',
										borderWidth: '1px',
										outline: 'none',
										cursor: 'pointer',
										margin: 0,
									}}
									onClick={() => {
										if (adSubPageFilterIds.includes(adSubPageId)) {
											const updatedSlugs = adSubPageFilterIds.filter(
												(slug) => slug !== adSubPageId
											)
											setAdSubPageFilterIds(updatedSlugs)
										} else {
											const updatedSlugs = [...adSubPageFilterIds, adSubPageId]
											setAdSubPageFilterIds(updatedSlugs)
										}
									}}
								>
									<Checkmark
										color={adSubPage?.colorCode}
										showCircle={true}
										checked={adSubPageFilterIds.includes(adSubPageId)}
									/>
									{adSlugUser && (
										<div
											style={{
												fontWeight: '500',
												fontSize: '16px',
											}}
											onClick={() => {
												setAdSlugUser(adSubPageId)
											}}
										>
											{adSubPage.nameByLang?.[penultimateElement] ??
												adSubPage.name}
										</div>
									)}
								</button>
							))}
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<button
						type="button"
						style={{
							backgroundColor: isOnlyBasketVisible
								? 'rgb(26, 37, 47)'
								: 'rgb(44, 62, 80)',
							borderColor: isOnlyBasketVisible
								? 'rgb(26, 37, 47)'
								: 'rgb(44, 62, 80)',
							color: 'white',
							padding: '10px 30px',
							borderRadius: '3px',
							borderStyle: 'solid',
							borderWidth: '1px',
							outline: 'none',
							cursor: 'pointer',
							textAlign: 'center',
							margin: 0,
							fontWeight: '500',
							fontSize: '16px',
							borderTopRightRadius: '0px',
							borderBottomRightRadius: '0px',
						}}
						onClick={() => {
							setIsOnlyBasketVisible(true)
							setIsOnlyUserBookingVisible(false)
						}}
					>
						{penultimateElement == 'en' ? <>Basket</> : <>Kosár</>}
					</button>
					{auth.userDTO && (
						<button
							type="button"
							style={{
								backgroundColor: isOnlyUserBookingVisible
									? 'rgb(26, 37, 47)'
									: 'rgb(44, 62, 80)',
								borderColor: isOnlyUserBookingVisible
									? 'rgb(26, 37, 47)'
									: 'rgb(44, 62, 80)',
								color: 'white',
								padding: '10px 30px',
								borderRadius: '0px',
								borderStyle: 'solid',
								borderWidth: '1px',
								outline: 'none',
								cursor: 'pointer',
								textAlign: 'center',
								margin: 0,
								fontWeight: '500',
								fontSize: '16px',
							}}
							onClick={() => {
								setIsOnlyBasketVisible(false)
								setIsOnlyUserBookingVisible(true)
							}}
						>
							{penultimateElement == 'en' ? <>Bookings</> : <>Foglalásaim</>}
						</button>
					)}
					<button
						type="button"
						style={{
							backgroundColor:
								isOnlyBasketVisible || isOnlyUserBookingVisible
									? 'rgb(44, 62, 80)'
									: 'rgb(26, 37, 47)',
							borderColor:
								isOnlyBasketVisible || isOnlyUserBookingVisible
									? 'rgb(44, 62, 80)'
									: 'rgb(26, 37, 47)',
							color: 'white',
							padding: '10px 30px',
							borderRadius: '3px',
							borderStyle: 'solid',
							borderWidth: '1px',
							outline: 'none',
							cursor: 'pointer',
							textAlign: 'center',
							margin: 0,
							fontWeight: '500',
							fontSize: '16px',
							borderTopLeftRadius: '0px',
							borderBottomLeftRadius: '0px',
						}}
						onClick={() => {
							setIsOnlyBasketVisible(false)
							setIsOnlyUserBookingVisible(false)
						}}
					>
						{penultimateElement == 'en' ? <>All</> : <>Mind</>}
					</button>
				</div>
			</div>
			<br />
			{startPaymentFrontend && adSubPageId && planId && (
				<div id="calendar">
					<FullCalendar
						ref={calendarRef}
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							listPlugin,
							interactionPlugin,
						]}
						initialView={initialView}
						slotMinTime={isShortCalendar == '1' ? '17:00:00' : '10:00:00'}
						slotMaxTime={isShortCalendar == '1' ? '22:00:00' : '22:00:00'}
						headerToolbar={{
							left: 'prev,next today',
							center: 'title',
							right:
								'dayGridMonth,timeGridWeek,timeGridDay,listMonth,timeGridThreeDay',
						}}
						views={{
							dayGridMonth: { buttonText: 'Month' },
							timeGridWeek: { buttonText: 'Week' },
							timeGridDay: { buttonText: 'Day' },
							listMonth: { buttonText: 'List' },
							timeGridThreeDay: {
								type: 'timeGrid',
								duration: { days: 3 },
								buttonText: '3 days',
							},
						}}
						contentHeight="auto"
						events={eventInputs}
						weekNumberCalculation="ISO"
						eventClick={(clickInfo) => {
							const { id, start, end, extendedProps } = clickInfo.event
							if (
								(!auth.userDTO && extendedProps.userName) ||
								(auth.userDTO &&
									extendedProps.userName &&
									extendedProps.userName != auth.userDTO?.userName)
							) {
								return
							}
							setSelectedEventTimeId(id)
							setSelectedStartTime(start ?? undefined)
							setSelectedEndTime(end ?? undefined)
							setSelectedAdSubPageId(extendedProps.adSubPageId)
							const eventTimeEditor =
								document.getElementById('event-time-editor')
							if (eventTimeEditor) {
								eventTimeEditor.scrollIntoView({
									behavior: 'smooth',
									block: 'center',
								})
							}
						}}
						editable={true}
						eventTimeFormat={{
							// set the time format
							hour: 'numeric',
							minute: '2-digit',
							meridiem: true,
						}}
						dateClick={(info) => {
							const selectedDate: Date = info.date
							if (!adSlugUser) {
								return
							}
							const now = new Date()
							if (selectedDate < now) {
								return
							}
							const oneHourLater = new Date(
								selectedDate.getTime() + 60 * 60 * 1000
							)
							const filteredEventInputs = eventInputs.filter((eventInput) => {
								return eventInput.extendedProps?.adSubPageId == adSubPageId
							})
							if (
								isDateHitBooking(info.date, oneHourLater, filteredEventInputs)
							) {
								return
							}
							const businessHoursStart =
								data?.adSubPages?.[adSubPageId]?.plans[planId]
									?.businessHoursStart ?? data?.businessHoursStart
							const businessHoursEnd =
								data?.adSubPages?.[adSubPageId]?.plans[planId]
									?.businessHoursEnd ?? data?.businessHoursEnd
							if (businessHoursStart) {
								const selectedDateWithStartHour = new Date(selectedDate)
								selectedDateWithStartHour.setHours(businessHoursStart, 0, 0, 0)
								if (selectedDate < selectedDateWithStartHour) {
									return
								}
							}
							if (businessHoursEnd) {
								const selectedDateWithEndHour = new Date(selectedDate)
								selectedDateWithEndHour.setHours(businessHoursEnd - 1, 0, 0, 0)
								if (selectedDate > selectedDateWithEndHour) {
									return
								}
							}
							const id = randomString(4)
							setStartPaymentFrontend({
								...startPaymentFrontend,
								adSubPagesData: {
									...startPaymentFrontend.adSubPagesData,
									[adSubPageId]: {
										...startPaymentFrontend.adSubPagesData[adSubPageId],
										eventTimes: {
											...startPaymentFrontend?.adSubPagesData?.[adSubPageId]
												.eventTimes,
											[id]: {
												startTime: selectedDate.toISOString(),
												endTime: oneHourLater.toISOString(),
											},
										},
									},
								},
							})
							setSelectedEventTimeId(id)
							setSelectedStartTime(selectedDate)
							setSelectedEndTime(oneHourLater)
							setSelectedAdSubPageId(adSubPageId)
							const eventTimeEditor =
								document.getElementById('event-time-editor')
							if (eventTimeEditor) {
								eventTimeEditor.scrollIntoView({
									behavior: 'smooth',
									block: 'center',
								})
							}
						}}
						eventResize={(resizeInfo) => {
							const { id, start, end, extendedProps } = resizeInfo.event
							const now = new Date()
							if (!start) {
								resizeInfo.revert()
								return
							}
							const startDate = new Date(start)
							if (startDate < now) {
								resizeInfo.revert()
								return
							}
							const previousStartTime = resizeInfo.oldEvent.start
							const filteredEventInputs = eventInputs.filter((eventInput) => {
								return (
									eventInput.id !== id &&
									eventInput.extendedProps?.adSubPageId == adSubPageId
								)
							})
							if (isDateHitBooking(start, end, filteredEventInputs)) {
								resizeInfo.revert()
								return
							}
							const businessHoursStart =
								data?.adSubPages?.[adSubPageId]?.plans[planId]
									?.businessHoursStart ?? data?.businessHoursStart
							const businessHoursEnd =
								data?.adSubPages?.[adSubPageId]?.plans[planId]
									?.businessHoursEnd ?? data?.businessHoursEnd
							if (businessHoursStart && start) {
								const selectedDateWithStartHour = new Date(start)
								selectedDateWithStartHour.setHours(businessHoursStart, 0, 0, 0)
								if (start < selectedDateWithStartHour) {
									resizeInfo.revert()
									return
								}
							}
							if (businessHoursEnd && end) {
								const selectedDateWithEndHour = new Date(end)
								selectedDateWithEndHour.setHours(businessHoursEnd, 0, 0, 0)
								if (end > selectedDateWithEndHour) {
									resizeInfo.revert()
									return
								}
							}
							const startTime = start?.toISOString()
							const endTime = end?.toISOString() ?? undefined
							/*if (
									(!auth.userDTO && extendedProps.userName) ||
									(auth.userDTO &&
										extendedProps.userName &&
										extendedProps.userName != auth.userDTO?.userName)
								) {
									resizeInfo.revert()
									return
								}*/

							if (extendedProps.isBasket == false && auth.userDTO?.token) {
								fetchWithBaseUrl('changeTicketEventTime', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										Authorization: 'Bearer ' + auth.userDTO.token,
									},
									body: JSON.stringify({
										ticketId: id,
										startTime,
										endTime,
									}),
								}).then(async (response) => {
									fetchWithBaseUrl(
										`user/product?teamSlug=${teamSlug}&adSlug=${adSlugUser}`,
										{
											method: 'GET',
											headers: {
												'Content-Type': 'application/json',
											},
										}
									).then(async (response) => {
										const data = await response.json()
										setData(data)
										setStartPaymentFrontend({
											...startPaymentFrontend,
											adSubPagesData: {
												...startPaymentFrontend.adSubPagesData,
												[adSubPageId]: {
													...startPaymentFrontend.adSubPagesData[adSubPageId],
													eventTimes: {
														...(startPaymentFrontend?.adSubPagesData?.[
															adSubPageId
														].eventTimes ?? {}),
														[id]: {
															startTime,
															endTime,
														},
													},
												},
											},
										})
									})
								})
							} else if (extendedProps.isBasket == true) {
								setStartPaymentFrontend({
									...startPaymentFrontend,
									adSubPagesData: {
										...startPaymentFrontend.adSubPagesData,
										[adSubPageId]: {
											...startPaymentFrontend.adSubPagesData[adSubPageId],
											eventTimes: {
												...startPaymentFrontend?.adSubPagesData?.[adSubPageId]
													.eventTimes,
												[id]: {
													startTime,
													endTime,
												},
											},
										},
									},
								})
							} else {
								resizeInfo.revert()
								return
							}
						}}
						eventDrop={(dropInfo: {
							event: EventApi
							delta: Duration
							revert: () => void
						}) => {
							const { id, start, end, extendedProps } = dropInfo.event
							const now = new Date()
							if (!start) {
								dropInfo.revert()
								return
							}
							const startDate = new Date(start)
							if (startDate < now) {
								dropInfo.revert()
								return
							}
							const filteredEventInputs = eventInputs.filter((eventInput) => {
								return (
									eventInput.id !== id &&
									eventInput.extendedProps?.adSubPageId == adSubPageId
								)
							})
							if (isDateHitBooking(start, end, filteredEventInputs)) {
								dropInfo.revert()
								return
							}
							const startTime = start?.toISOString() ?? undefined
							const endTime = end?.toISOString() ?? undefined
							console.log(`Event with ID ${id} was dropped onto ${start}`)
							const businessHoursStart =
								data?.adSubPages?.[adSubPageId]?.plans[planId]
									?.businessHoursStart ?? data?.businessHoursStart
							const businessHoursEnd =
								data?.adSubPages?.[adSubPageId]?.plans[planId]
									?.businessHoursEnd ?? data?.businessHoursEnd
							if (businessHoursStart && start) {
								const selectedDateWithStartHour = new Date(start)
								selectedDateWithStartHour.setHours(businessHoursStart, 0, 0, 0)
								if (start < selectedDateWithStartHour) {
									dropInfo.revert()
									return
								}
							}
							if (businessHoursEnd && end) {
								const selectedDateWithEndHour = new Date(end)
								selectedDateWithEndHour.setHours(businessHoursEnd, 0, 0, 0)
								if (end > selectedDateWithEndHour) {
									dropInfo.revert()
									return
								}
							}
							if (extendedProps.isBasket == false && auth.userDTO?.token) {
								fetchWithBaseUrl('changeTicketEventTime', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										Authorization: 'Bearer ' + auth.userDTO.token,
									},
									body: JSON.stringify({
										ticketId: id,
										startTime,
										endTime,
									}),
								}).then(async (response) => {
									fetchWithBaseUrl(
										`user/product?teamSlug=${teamSlug}&adSlug=${adSlugUser}`,
										{
											method: 'GET',
											headers: {
												'Content-Type': 'application/json',
											},
										}
									).then(async (response) => {
										const data = await response.json()
										setData(data)
										setStartPaymentFrontend({
											...startPaymentFrontend,
											adSubPagesData: {
												...startPaymentFrontend.adSubPagesData,
												[adSubPageId]: {
													...startPaymentFrontend.adSubPagesData[adSubPageId],
													eventTimes: {
														...startPaymentFrontend?.adSubPagesData?.[
															adSubPageId
														].eventTimes,
														[id]: {
															startTime,
															endTime,
														},
													},
												},
											},
										})
									})
								})
							} else if (extendedProps.isBasket == true) {
								setStartPaymentFrontend({
									...startPaymentFrontend,
									adSubPagesData: {
										...startPaymentFrontend.adSubPagesData,
										[adSubPageId]: {
											...startPaymentFrontend.adSubPagesData[adSubPageId],
											eventTimes: {
												...startPaymentFrontend?.adSubPagesData?.[adSubPageId]
													.eventTimes,
												[id]: {
													startTime,
													endTime,
												},
											},
										},
									},
								})
							} else {
								dropInfo.revert()
								return
							}

							/*const eventTimeInStartPayment =
									startPaymentFrontend?.adSubPagesData?.[
										extendedProps.productSlug
									][planId ?? '']?.eventTimes?.[id]
								if (!eventTimeInStartPayment) {
									if (
										!auth.userDTO ||
										!teamSlugUser ||
										!auth.userDTO?.email ||
										(extendedProps.userName != auth.userDTO?.userName &&
											!auth.userDTO?.isTikexAdmin &&
											auth.userDTO?.teams?.[teamSlugUser]
												?.usersWithPermission?.[auth.userDTO?.email]?.range !=
												'all')
									) {
										dropInfo.revert()
										return
									}
									fetchWithBaseUrl('changeTicketEventTime', {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
											Authorization: 'Bearer ' + auth.userDTO?.token,
										},
										body: JSON.stringify({
											ticketId: id,
											startTime,
											endTime,
										}),
									}).then(async (response) => {
										fetchWithBaseUrl(
											`user/product?teamSlug=${teamSlug}&firstLevelCategorySlug=${productSlugUser}`,
											{
												method: 'GET',
												headers: {
													'Content-Type': 'application/json',
												},
											}
										).then(async (response) => {
											const data = await response.json()
											setData(data)
											const keys = Object.keys(data)
											//if (keys.length > 0) {
											setAdSubPageFilterIds(keys)
											//setProductSlugUser(keys[0])
											//}
										})
									})
								} else {
									if (
										!productSlugUser ||
										!startPaymentFrontend?.adSubPagesData[
											productSlugUser
										] ||
										!start ||
										!startTime ||
										!end ||
										!endTime
									) {
										dropInfo.revert()
										return
									}
									let startPaymentFrontendProduct = {
										...startPaymentFrontend?.adSubPagesData[
											extendedProps.productSlug
										][planId],
									}
									if (!startPaymentFrontendProduct) {
										dropInfo.revert()
										return
									}

									if (
										startPaymentFrontendProduct.eventTimes &&
										startTime &&
										endTime
									) {
										startPaymentFrontendProduct.eventTimes[id] = {
											startTime,
											endTime,
										}
									} else {
										dropInfo.revert()
										return
									}
									let _startPaymentFrontend = { ...startPaymentFrontend }
									_startPaymentFrontend.adSubPagesData[
										extendedProps.productSlug
									][planId] = startPaymentFrontendProduct
									setStartPaymentFrontend(_startPaymentFrontend)
								}*/
						}}
						dayHeaderFormat={{
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						}}
					/>
				</div>
			)}
			{startPaymentFrontend &&
				selectedEventTimeId &&
				selectedStartTime &&
				selectedEndTime &&
				data &&
				startPaymentFrontend &&
				adSubPageId && (
					<div className="form-box" style={{ width: '300px', height: '80%' }}>
						<p>Terem</p>
						<select
							className="input-select"
							value={adSubPageId ?? ''}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
								setAdSubPageId(e.target.value)
								const planIds = Object.keys(
									data.adSubPages?.[e.target.value]?.plans ?? {}
								)
								if (planIds.length == 0 || !planId) {
									return
								}
								const firstPlanId = planIds[0]
								setPlanId(firstPlanId)
								const newStartPaymentFrontend = {
									...startPaymentFrontend,
									adSubPagesData: {
										...startPaymentFrontend.adSubPagesData,
										[e.target.value]: {
											...(startPaymentFrontend.adSubPagesData[e.target.value] ??
												{}),
											eventTimes: {
												...(startPaymentFrontend?.adSubPagesData?.[
													e.target.value
												]?.eventTimes ?? {}),
												[selectedEventTimeId]:
													startPaymentFrontend!.adSubPagesData![adSubPageId]!
														.eventTimes![selectedEventTimeId],
											},
											planId: firstPlanId,
										},
									},
								}
								delete newStartPaymentFrontend?.adSubPagesData?.[adSubPageId]
									?.eventTimes?.[selectedEventTimeId]
								setStartPaymentFrontend(newStartPaymentFrontend)
								setSelectedEventTimeId(undefined)
							}}
						>
							{Object.entries(data.adSubPages ?? {})
								.sort((a, b) => (a[0] > b[0] ? 1 : -1))
								.map(([adSubPageId, adSubPage]) => (
									<option key={adSubPageId} value={adSubPageId}>
										{adSubPage.name}
									</option>
								))}
						</select>
						<p id="event-time-editor">Kezdés (MM/DD/YYYY)</p>
						<DatePicker
							selected={selectedStartTime}
							onChange={(date: Date) => {
								setSelectedStartTime(date)
							}}
							showTimeSelect
							dateFormat="Pp"
						/>
						<p>Befejezés</p>
						<DatePicker
							selected={selectedEndTime}
							onChange={(date: Date) => {
								setSelectedEndTime(date)
							}}
							showTimeSelect
							dateFormat="Pp"
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
							}}
						>
							<button
								className="btn btn-sm btn-circle"
								disabled={modalSaveDisabled}
								onClick={() => {
									const startTime =
										selectedStartTime?.toISOString() ?? undefined
									const endTime = selectedEndTime?.toISOString() ?? undefined
									if (!adSubPageId || !planId) {
										return
									}
									setStartPaymentFrontend({
										...startPaymentFrontend,
										adSubPagesData: {
											...startPaymentFrontend.adSubPagesData,
											[adSubPageId]: {
												...startPaymentFrontend.adSubPagesData[adSubPageId],
												eventTimes: {
													...startPaymentFrontend?.adSubPagesData?.[adSubPageId]
														.eventTimes,
													[selectedEventTimeId]: {
														startTime,
														endTime,
													},
												},
											},
										},
									})
								}}
								style={{ color: modalSaveDisabled ? 'gray' : 'white' }}
							>
								{penultimateElement == 'en' ? <>Save</> : <>Mentés</>}
							</button>
							<button
								className="btn btn-sm btn-circle"
								onClick={() => {
									if (!adSubPageId || !planId || !selectedAdSubPageId) {
										return
									}
									const newStartPaymentFrontend = { ...startPaymentFrontend }
									delete newStartPaymentFrontend?.adSubPagesData?.[
										selectedAdSubPageId
									]?.eventTimes?.[selectedEventTimeId]
									setStartPaymentFrontend(newStartPaymentFrontend)
									setSelectedEventTimeId(undefined)
									const calendarElement = document.getElementById('calendar')
									if (calendarElement) {
										calendarElement.scrollIntoView({
											behavior: 'smooth',
											block: 'center',
										})
									}
								}}
							>
								{penultimateElement == 'en' ? (
									<>Remove event time</>
								) : (
									<>Időpont törlése</>
								)}
							</button>
							<button
								className="btn btn-sm btn-circle"
								onClick={() => {
									setSelectedEventTimeId(undefined)
									const calendarElement = document.getElementById('calendar')
									if (calendarElement) {
										calendarElement.scrollIntoView({
											behavior: 'smooth',
											block: 'center',
										})
									}
								}}
							>
								{penultimateElement == 'en' ? <>Cancel</> : <>Mégsem</>}
							</button>
						</div>
					</div>
				)}
			<br />
			<select
				value={isShortCalendar}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					setIsShortCalendar(e.target.value)
				}}
				className="input-select"
				style={{ maxWidth: '200px' }}
			>
				{penultimateElement == 'en' ? (
					<>
						<option value="1" key="1">
							Evening times
						</option>
						<option value="0" key="0">
							All day times
						</option>
					</>
				) : (
					<>
						<option value="1" key="1">
							Esti időpontok nézet
						</option>
						<option value="0" key="0">
							Minden időpont nézet
						</option>
					</>
				)}
			</select>
			<br />
			<br />
			{data &&
				adSlugUser &&
				//data.adSubPages?.[productSlugUser] &&
				startPaymentFrontend && (
					<div className="form-box" id="purchase-form-container">
						<ShoppingCart
							teamSlug={teamSlug}
							userProductDTO={data}
							adSlug={adSlugUser}
							platform={'wordpress'}
							startPaymentFrontend={startPaymentFrontend}
							setStartPaymentFrontend={setStartPaymentFrontend}
							adSubPageId={adSubPageId}
							setAdSubPageId={setAdSubPageId}
							planId={planId}
							setPlanId={setPlanId}
							isCheckoutVisible={isCheckoutVisible}
							setIsCheckoutVisible={setIsCheckoutVisible}
							isLoginVisible={isLoginVisible}
							setIsLoginVisible={setIsLoginVisible}
							isCalendar={true}
							navigateToPaymentPressed={() => {
								setSelectedEventTimeId(undefined)
								setSelectedStartTime(undefined)
								setSelectedEndTime(undefined)
							}}
						/>
					</div>
				)}
			<br />
			{auth.userDTO && (
				<a
					onClick={() => {
						const teamIds = Object.keys(auth.userDTO?.teams ?? {})
						if (teamIds.length > 0) {
							window.location.href = 'https://tikex.com/' + teamIds[0]
						} else if (!auth.userDTO?.email) {
							alert('Please register with email or Google to user admin pages')
						} else {
							auth.handleCreateTeam((userDTO) => {
								const teamIds = Object.keys(userDTO?.teams ?? {})
								if (teamIds.length > 0) {
									const teamId = teamIds[0]
									window.location.href = 'https://tikex.com/' + teamIds[0]
								} else {
									alert('Please register with email or Google')
								}
							})
						}
					}}
					className="btn btn-sm"
				>
					Szeretnéd értékesíteni a jegyeidet?
				</a>
			)}
		</div>
	)
}
