import React, { useEffect, useState } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import ImageUpload from '../../../tikexModule/components/ImageUpload'
import Input from '../../../tikexModule/components/inputs/Input'
import Select from '../../../tikexModule/components/inputs/Select'
import Switch from '../../../tikexModule/components/inputs/Switch'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import randomString from '../../../tikexModule/utils/randomString'
import Accordion from '../../components/Accordion'

export default function FormsEditorContent({
	children,
}: {
	children?: React.ReactNode
}) {
	const auth = useAuth()
	const [teamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)
	const organization = auth.userDTO?.teams?.[teamId]
	const [formId, setFormId] = useState<string>('')

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const _formId = urlParams.get('formId')
		setFormId(_formId ?? '')
	}, [])

	if (auth.userDTO) {
		return (
			<div className="wrap">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<h1>Űrlapok</h1>
					<button
						className="button button-primary"
						onClick={() => {
							const id = randomString(4)
							auth.updateClientAndServer({
								keyPath: [teamId, 'forms', id],
								value: {
									formFields: {},
									name: 'Új Űrlap',
								},
								operation: 'setValue',
							})
							setFormId(id)
						}}
					>
						Új Űrlap létrehozás
					</button>
				</div>
				<br />
				<div className="container">
					<table className="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label>Űrlap</label>
								</th>
								<td>
									<select
										value={formId}
										onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
											const url = new URL(window.location.href)
											url.searchParams.append('formId', event.target.value)
											window.location.href = url.href
										}}
										className={'input-select'}
										style={{ margin: '0' }}
									>
										<option value="">- Válassz -</option>
										{Object.entries(
											auth?.userDTO?.teams?.[teamId]?.forms ?? {}
										).map(([key, value]) => (
											<option key={key} value={key}>
												{value?.name ?? key}
											</option>
										))}
									</select>
								</td>
							</tr>
							{formId && (
								<tr>
									<th scope="row">
										<label>Név</label>
									</th>
									<td>
										<Input
											keyPath={[teamId, 'forms', formId, 'name']}
											placeholder="pl. E-mail cím + szobatípus"
											data-cy="program-name"
											className="regular-text"
											type="text"
										/>
									</td>
								</tr>
							)}
							{formId && (
								<tr>
									<th scope="row">
										{auth?.userDTO?.isTikexAdmin && (
											<button
												className="button button-primary"
												style={{ margin: '0' }}
												onClick={() => {
													if (formId) {
														auth.updateClientAndServer({
															keyPath: [teamId, 'forms', formId],
															operation: 'removeKey',
														})
														setFormId('')
													}
												}}
											>
												Űrlap törlés
											</button>
										)}
									</th>
									<td></td>
								</tr>
							)}
						</tbody>
					</table>
					<br />
					{formId && (
						<>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<h1>Űrlap mezők</h1>
								<button
									className="button button-primary"
									onClick={() => {
										auth.updateClientAndServer({
											keyPath: [
												teamId,
												'forms',
												formId,
												'formFields',
												randomString(4),
											],
											value: {
												name: `Új mező`,
												type: 'textField',
												mandatory: false,
												ind: Object.keys(
													organization?.forms?.[formId]?.formFields ?? {}
												).length,
											},
											operation: 'setValue',
										})
									}}
								>
									Új Űrlap mező létrehozása
								</button>
							</div>
							<br />
							{Object.entries(organization?.forms?.[formId]?.formFields ?? {})
								.sort((a, b) => (a?.[1]?.ind! > b?.[1]?.ind! ? 1 : -1))
								.map(([formFieldId, formField], index) => (
									<Accordion title={formField.name}>
										<table className="form-table" role="presentation">
											<tbody>
												<tr>
													<th scope="row">
														<label>Megnevezés</label>
													</th>
													<td>
														<Input
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'name',
															]}
															placeholder="pl. E-mail cím"
															className="regular-text"
															type="text"
														/>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<label>Típus</label>
													</th>
													<td>
														<Select
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'type',
															]}
															placeholder="type"
														>
															<option value="">- Válassz -</option>
															<option value="textField">Rövid válasz</option>
															{/*<option value="textArea">Bekezdés</option>*/}
															{/*<option value="radio">Feleletválasztós</option>*/}
															{/*<option value="checkmark">
																Jelölő négyzetek
															</option>*/}
															<option value="selectItem">Legördülő menü</option>
														</Select>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<label>Sorszám</label>
													</th>
													<td>
														<Input
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'ind',
															]}
															placeholder="pl. 7"
															isInt={true}
															type="text"
															className="regular-text"
														/>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<label>Leírás</label>
													</th>
													<td>
														<Input
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'details',
															]}
															placeholder="pl. Rendezvény szervezés"
															className="regular-text"
															type="text"
														/>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<label>Kötelező</label>
													</th>
													<td>
														<Select
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'mandatory',
															]}
															isBool={true}
														>
															<option value={1}>Kötelező</option>
															<option value={0}>Opcionális</option>
														</Select>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<label>Kép</label>
													</th>
													<td>
														<ImageUpload
															bucket={'ticket-t01'}
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'imgId',
															]}
															srcFallback={
																'https://themekit.dev/shared/thumbs/wide.png'
															}
															width={284}
															height={166}
															completion={(id: any) => {}}
															imgRef={`${index}`}
														/>
													</td>
												</tr>
												{(formField.type == 'selectItem' ||
													formField.type == 'radio' ||
													formField.type == 'checkmark') && (
													<>
														<tr>
															<th scope="row">
																<label>Opciók</label>
															</th>
															<td>
																<div
																	style={{
																		display: 'flex',
																		justifyContent: 'flex-end',
																		width: '100%',
																	}}
																>
																	<button
																		className="button button-primary"
																		onClick={() => {
																			auth.updateClientAndServer({
																				keyPath: [
																					teamId,
																					'forms',
																					formId,
																					'formFields',
																					formFieldId,
																					'options',
																					randomString(4),
																				],
																				value: {
																					ind: Object.keys(
																						formField.options ?? {}
																					).length,
																				},
																				operation: 'setValue',
																			})
																		}}
																	>
																		Opció hozzáadása
																	</button>
																</div>
															</td>
														</tr>
														{Object.entries(formField.options ?? {})
															.sort((a, b) =>
																a[1]?.ind! > b[1]?.ind! ? 1 : -1
															)
															.map(([optionKey, optionValue], optionIndex) => (
																<>
																	<tr>
																		<th scope="row">
																			<label>Opció megnevezése</label>
																		</th>
																		<td>
																			<Input
																				keyPath={[
																					teamId,
																					'forms',
																					formId,
																					'formFields',
																					formFieldId,
																					'options',
																					optionKey,
																					'name',
																				]}
																				placeholder="Opció megnevezése"
																				className="regular-text"
																				type="text"
																			/>
																		</td>
																	</tr>
																	<tr>
																		<th scope="row">
																			<label>Sorszám</label>
																		</th>
																		<td>
																			<Input
																				keyPath={[
																					teamId,
																					'forms',
																					formId,
																					'formFields',
																					formFieldId,
																					'options',
																					optionKey,
																					'ind',
																				]}
																				placeholder="Sorszám"
																				isInt={true}
																				type="text"
																				className="regular-text"
																			/>
																		</td>
																	</tr>
																	<tr>
																		<th scope="row">
																			<button
																				className="button button-primary"
																				onClick={() => {
																					auth.updateClientAndServer({
																						keyPath: [
																							teamId,
																							'forms',
																							formId,
																							'formFields',
																							formFieldId,
																							'options',
																							optionKey,
																						],
																						operation: 'removeKey',
																					})
																				}}
																			>
																				Opció törlés
																			</button>
																		</th>
																		<td></td>
																	</tr>
																</>
															))}
													</>
												)}
												<tr>
													<th scope="row">
														<label>Űrlap mező elrejtése</label>
													</th>
													<td>
														<Switch
															keyPath={[
																teamId,
																'forms',
																formId,
																'formFields',
																formFieldId,
																'hidden',
															]}
														/>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button
															className="button button-primary"
															onClick={() => {
																auth.updateClientAndServer({
																	keyPath: [
																		teamId,
																		'forms',
																		formId,
																		'formFields',
																		formFieldId,
																	],
																	operation: 'removeKey',
																})
															}}
														>
															Űrlap mező törlés
														</button>
													</th>
													<td></td>
												</tr>
											</tbody>
										</table>
									</Accordion>
								))}
						</>
					)}
				</div>
			</div>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}
