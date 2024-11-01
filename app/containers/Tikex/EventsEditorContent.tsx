import React, { useEffect, useState } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import { v4 as uuid } from 'uuid'
import { SzamlazzhuVatKey } from '../../../tikexModule/Types/dto/team'
import { missingFieldToRunEvent } from '../../../tikexModule/checkEnableSale'
import Input from '../../../tikexModule/components/inputs/Input'
import Select from '../../../tikexModule/components/inputs/Select'
import Switch from '../../../tikexModule/components/inputs/Switch'
import SwitchBase from '../../../tikexModule/components/inputs/SwitchPass'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import randomString from '../../../tikexModule/utils/randomString'
import slugify from '../../../tikexModule/utils/slugify'
import Accordion from '../../components/Accordion'
import { Plan } from '../../../tikexModule/Types/models/team'
import { fetchWithBaseUrl } from '../../../utils/api'

export default function EventsEditorContent({
	children,
}: {
	children?: React.ReactNode
}) {
	const auth = useAuth()
	const [teamId, setSelectedTeamId] = useLocalStorage<string>(
		'teamIdDashboard',
		''
	)
	const [newProductId, setNewProductId] = useState<string>('')
	const [productId, setProductId] = useLocalStorage<string>(
		'productIdDashboard',
		''
	)
	const o = auth.userDTO?.teams?.[teamId]
	const paymentAndInvoiceRecipients = o?.paymentAndInvoiceRecipients
	const product = o?.ads?.[productId]
	const pr = product
	const passTypeOptions = Object.entries(o?.passTypes ?? {}).map(
		([passTypeId, passType]) => {
			return {
				value: passTypeId,
				label: `Ár: ${passType.price} - Kapacitás: ${passType.capacity} - Lejárat: ${passType.expirationDays}`,
			}
		}
	)
	const missingField = missingFieldToRunEvent(product)

	useEffect(() => {
		if (productId) {
			setNewProductId(productId)
		}
	}, [productId])

	function countInvoiceItemSchemas(pricingOption: Plan): number {
		if (!pricingOption || !pricingOption.paymentRecipients) {
			return 0
		}

		return Object.keys(pricingOption.paymentRecipients).reduce(
			(totalCount, key) => {
				const group = pricingOption.paymentRecipients?.[key]
				if (group?.products) {
					return totalCount + Object.keys(group.products).length
				}
				return totalCount
			},
			0
		)
	}

	if (auth.userDTO) {
		return <></>
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}

/*<div className="wrap">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<h1>Termékek / Események</h1>
					<div
						style={{
							display: 'flex',
							gap: '1rem',
							flexDirection: 'column',
						}}
					>
						<button
							className="button button-primary"
							onClick={() => {
								if (
									Object.entries(o?.paymentAndInvoiceRecipients ?? {}).length ==
									0
								) {
									alert('Kérlek, adj hozzá egy kedvezményezettet.')
								}
								const payee = Object.entries(
									o?.paymentAndInvoiceRecipients ?? {}
								)[0][1]
								if (payee.name && payee.barionId) {
									const id = randomString(4)
									const value = {
										name: 'Új esemény',
										enableSendInvoice: true,
										timeSelectionType: 'oneOrManyTime',
										pricingOptions: {
											[id]: {
												invoiceItems: {
													[id]: {
														ind: 0,
														invoiceItemQuantityType: 'fix',
														name: 'Számlatétel megnevezése',
														paymentAndInvoiceRecipientId: Object.entries(
															o?.paymentAndInvoiceRecipients ?? {}
														)[0][1].name,
														quantity: 1,
														unit: 'db',
														vatKey: 'AAM',
													},
												},
											},
										},
										welcomeEmailSender: auth?.userDTO?.email,
										eventTimes: {},
										welcomeMessage: `<tr>\n\t<td style="padding: 30px 0px 30px; font-size: 32px; font-weight: bold;">\n\t\tKedves Résztvevő!\n\t</td>\n</tr>\n<tr>\n\t<td style="padding: 0px 0px 30px;">\n\t\tÖrülünk, hogy velünk tartasz rendezvényünkön! További részletekkel hamarosan jelentkezünk!\n\t</td>\n</tr>\n<tr>\n\t<td style="padding: 0px 0px 30px;">\n\t\tÜdvözlettel a szervezők\n\t</td>\n</tr>`,
									}
									auth.updateClientAndServer({
										keyPath: [teamId, 'products', `${teamId}-${id}`],
										value,
										operation: 'setValue',
									})
									setProductId(`${teamId}-${id}`)
								} else if (!payee.name) {
									alert('Kérlek, add meg a kedvezményettnek a nevét.')
								} else if (!payee.barionId) {
									alert('Kérlek, add meg a kedvezményezettnek a BarionId-ját.')
								}
							}}
						>
							Létrehozás
						</button>
						{productId && product && (
							<button
								className="button button-primary"
								onClick={() => {
									auth.updateClientAndServer({
										keyPath: [teamId, 'products', productId + '-copy'],
										value: {
											...product,
											name: product.name + ' Copy',
											isRequiredToSendTestFinalInvoice: false,
											isRequiredToStartFinalInvoicing: false,
											eventTimes: {},
											enableSale: false,
										},
										operation: 'setValue',
									})
									setProductId(productId + '-copy')
								}}
							>
								Duplikálás
							</button>
						)}
					</div>
				</div>
				<br />
				<table className="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label>Termék / Esemény</label>
							</th>
							<td>
								<select
									onChange={(e) => {
										let v = e?.target?.value
										setProductId(v)
									}}
									value={productId}
								>
									<option value="">- Válassz -</option>
									{Object.entries(o?.ads ?? {})
										.sort((a, b) => a[1].name.localeCompare(b[1].name))
										.map(([k, v]) => (
											<option key={k} value={k}>
												{v.name}
											</option>
										))}
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				{productId && (
					<>
						<table className="form-table" role="presentation">
							<tbody>
								<tr>
									<th scope="row">
										<label>Név</label>
									</th>
									<td>
										<Input
											keyPath={[teamId, 'products', productId, 'name']}
											placeholder="pl. Egy nagyszerű tanfolyam"
											data-cy="program-name"
											type="text"
											className="regular-text"
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>Slug - Program azonosítója az url-ben</label>
									</th>
									<td>
										<Input
											placeholder="slug"
											keyPath={[teamId, 'products', productId, 'slug']}
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>A vásárlási űrlap shortcode-ja</label>
									</th>
									<td>
										<code>
											[tikex_buy_ticket_form team_slug="{teamId}" program_id="
											{pr?.slug}"]
										</code>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>Termék vagy Esemény</label>
									</th>
									<td>
										<Select
											keyPath={[
												teamId,
												'products',
												productId,
												'timeSelectionType',
											]}
										>
											<option value="" disabled={!!product?.timeSelectionType}>
												- Válassz -
											</option>
											<option value="oneOrManyTime">
												Esemény - Egy vagy több időpont is tartozik hozzá
											</option>
											<option value="noTime">
												Termék - Nem tartozik hozzá időpont
											</option>
											{false && (
												<option value="calendar">
													Naptárból lehet az érkezési, indulási napot
													kiválasztani
												</option>
											)}
										</Select>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>Program alcím</label>
									</th>
									<td>
										<Input
											keyPath={[teamId, 'products', productId, 'subtitle']}
											data-cy="program-subtitle"
											type="text"
											className="regular-text"
										/>
									</td>
								</tr>
								{pr?.timeSelectionType == 'oneOrManyTime' && (
									<tr>
										<th scope="row">
											<label>
												Esemény helyszíne{' '}
												<span style={{ color: 'red' }}>*</span>
											</label>
										</th>
										<td>
											<Input
												keyPath={[teamId, 'products', productId, 'place']}
												placeholder="pl. Tokaji borvidék"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
								)}
								<tr>
									<th scope="row">
										<label>Űrlap</label>
									</th>
									<td>
										<Select
											keyPath={[teamId, 'products', productId, 'formId']}
											disabledPrio={pr?.enableSale}
										>
											<option value="">- Válassz -</option>
											{Object.entries(o?.forms ?? {})
												.sort((a, b) => a[0].localeCompare(b[0]))
												.map(([k2, v2], i2) => (
													<option value={k2} key={k2}>
														{v2?.name ?? k2}
													</option>
												))}
										</Select>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>
											Megengedett különbség a nők és férfiak száma között
										</label>
									</th>
									<td>
										<Input
											keyPath={[
												teamId,
												'products',
												productId,
												'allowedDifferenceBetweenMenAndWomen',
											]}
											placeholder="pl. 5"
											isInt={true}
											type="text"
											className="regular-text"
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>
											Értékesítés engedélyezése az esemény vége után
										</label>
									</th>
									<td>
										<Switch
											keyPath={[
												teamId,
												'products',
												productId,
												'enableSalesAfterEventFinished',
											]}
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>Csak egy jegy vásárlásának engedélyezése</label>
									</th>
									<td>
										<Switch
											keyPath={[
												teamId,
												'products',
												productId,
												'allowedPurchaseOnlyOneTicket',
											]}
										/>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label>Viszonteladás és ajándékozás tiltása</label>
									</th>
									<td>
										<Switch
											keyPath={[
												teamId,
												'products',
												productId,
												'isResaleAndGiftingPrevented',
											]}
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<Accordion title="Az eseményhez tartozó bérletek">
							<table>
								<tbody>
									{passTypeOptions?.map(({ value: passTypeId, label }) => (
										<tr key={passTypeId} className="col-lg-12 toggle-cnt">
											<td>
												<div
													style={{
														display: 'flex',
														justifyContent: 'flex-start',
														alignItems: 'center',
														gap: '0.5rem',
													}}
												>
													<SwitchBase
														value={
															product?.passTypeIds?.includes(passTypeId) ??
															false
														}
														setValue={(newSwitchValue) => {
															let newPassTypeIds = [
																...(product?.passTypeIds ?? []),
															]
															if (newSwitchValue === true) {
																newPassTypeIds = [...newPassTypeIds, passTypeId]
															} else {
																newPassTypeIds = newPassTypeIds.filter(
																	(value) => value !== passTypeId
																)
															}
															auth.updateClientAndServer({
																keyPath: [
																	teamId,
																	'products',
																	productId,
																	'passTypeIds',
																],
																value: newPassTypeIds,
																operation: 'setValue',
															})
														}}
													/>
													<span>{label}</span>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Accordion>
						<Accordion title="Elérhetőségek">
							<table className="form-table" role="presentation">
								<tbody>
									<tr>
										<th scope="row">
											<label>Kapcsolattartó neve</label>
										</th>
										<td>
											<Input
												keyPath={[teamId, 'products', productId, 'contactName']}
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Kapcsolattartó telefonszáma</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'contactPhoneNumber',
												]}
												placeholder="pl. +36 30/123-4567"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Kapcsolattartó e-mail címe</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'contactEmail',
												]}
												placeholder="pl. info@email.hu"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Facebook oldal</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'facebookPageName',
												]}
												placeholder="pl. facebook.hu/mypage"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Weboldal</label>
										</th>
										<td>
											<Input
												keyPath={[teamId, 'products', productId, 'website']}
												placeholder="pl. mypage.com"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</Accordion>
						<Accordion title="Számlázás - árazás">
							<table className="form-table" role="presentation">
								<tbody>
									{Object.entries(pr?.adSubPages ?? {})
										.sort((a, b) => (a[1].ind ?? 0) - (b[1].ind ?? 0))
										.map(([k, v], i) => (
											<>
												{Object.entries(pr?.adSubPages ?? {})
													.length > 1 && (
													<>
														<tr>
															<th scope="row">
																<label>Megnevezés</label>
															</th>
															<td>
																<Input
																	keyPath={[
																		teamId,
																		'products',
																		productId,
																		'pricingOptions',
																		k,
																		'name',
																	]}
																	placeholder="Megnevezés"
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
																				'products',
																				productId,
																				'pricingOptions',
																				k,
																			],
																			operation: 'removeKey',
																		})
																	}}
																>
																	Opció törlése
																</button>
															</th>
															<td></td>
														</tr>
													</>
												)}
												<tr>
													<th scope="row"></th>
													<td>
														<div
															style={{
																display: 'flex',
																justifyContent: 'flex-end',
															}}
														>
															<div>
																<button
																	className="button button-primary"
																	onClick={() => {
																		const id = randomString(4)
																		const payee = Object.entries(
																			o?.paymentAndInvoiceRecipients ?? {}
																		)[0]

																		auth.updateClientAndServer({
																			keyPath: [
																				teamId,
																				'products',
																				productId,
																				'pricingOptions',
																				k,
																				'invoiceSchemaItemGroups',
																				payee?.[0],
																				'invoiceSchemaItems',
																				id,
																			],
																			value: {
																				ind: countInvoiceItemSchemas(v),
																				invoiceItemQuantityType: 'fix',
																				name: 'Számlatétel megnevezése',
																				quantity: 1,
																				unit: 'db',
																				vatKey: 'AAM',
																			},
																			operation: 'setValue',
																		})
																	}}
																>
																	Új számlatétel
																</button>
															</div>
														</div>
													</td>
												</tr>
												{Object.entries(v.plans ?? {})
													.sort((a, b) => a[0].localeCompare(b[0]))
													.map(([k2a, v2a], i2a) =>
														Object.entries(v2a.paymentRecipients ?? {})
															.sort(
																(a, b) => a[0].localeCompare(b[0]) //(b[1]?.ind ?? 0) - (a[1]?.ind ?? 0)
															)
															.map(([k2, v2], i2) => (
																<>
																	<tr>
																		<th scope="row"></th>
																		<td></td>
																	</tr>
																	<tr>
																		<th scope="row">
																			<label>Számlatétel megnevezése</label>
																		</th>
																		<td>
																			<Input
																				keyPath={[
																					teamId,
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'name',
																				]}
																				type="text"
																				className="regular-text"
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
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'ind',
																				]}
																				placeholder="pl. 2"
																				isInt={true}
																				type="text"
																				className="regular-text"
																			/>
																		</td>
																	</tr>
																	<tr>
																		<th scope="row">
																			<label>Áfa</label>
																		</th>
																		<td>
																			<Select
																				keyPath={[
																					teamId,
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'vatKey',
																				]}
																				placeholder="pl. AAM"
																			>
																				{Object.entries(SzamlazzhuVatKey).map(
																					([key, value]) => (
																						<option key={key}>{value}</option>
																					)
																				)}
																			</Select>
																		</td>
																	</tr>
																	<tr>
																		<th scope="row">
																			<label>Mértékegység</label>
																		</th>
																		<td>
																			<Input
																				keyPath={[
																					teamId,
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'unit',
																				]}
																				placeholder="pl. db"
																				type="text"
																				className="regular-text"
																			/>
																		</td>
																	</tr>
																	<tr>
																		<th scope="row">
																			<label>Ár</label>
																		</th>
																		<td>
																			<Input
																				keyPath={[
																					teamId,
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'unitPrice',
																				]}
																				placeholder="pl. 1000"
																				type="text"
																				className="regular-text"
																			/>
																		</td>
																	</tr>
																	<tr>
																		<th scope="row"></th>
																		<td>
																			<Select
																				keyPath={[
																					teamId,
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'invoiceItemQuantityType',
																				]}
																				onChange={(e) => {
																					let v3 = { ...v2 }
																					v3.invoiceItemQuantityType =
																						e.target.value
																					if (
																						v3.invoiceItemQuantityType ==
																						'flexible'
																					) {
																						delete v3.quantity
																					}
																					auth.updateClientAndServer({
																						keyPath: [
																							teamId,
																							'products',
																							productId,
																							'pricingOptions',
																							k,
																							'invoiceSchemaItemGroups',
																							k2a,
																							'invoiceSchemaItems',
																							k2,
																						],
																						value: v3,
																						operation: 'setValue',
																					})
																				}}
																			>
																				<option value="flexible">
																					Mennyiség - felhasználó választja
																				</option>
																				<option value="fix">
																					Mennyiség - rögzített
																				</option>
																			</Select>
																		</td>
																	</tr>
																	{v2.invoiceItemQuantityType == 'flexible' ? (
																		<>
																			<tr>
																				<th scope="row">
																					<label>Max mennyiség</label>
																				</th>
																				<td>
																					<Input
																						keyPath={[
																							teamId,
																							'products',
																							productId,
																							'pricingOptions',
																							k,
																							'invoiceSchemaItemGroups',
																							k2a,
																							'invoiceSchemaItems',
																							k2,
																							'max',
																						]}
																						placeholder="pl. 1"
																						isInt={true}
																						type="text"
																						className="regular-text"
																					/>
																				</td>
																			</tr>
																			<tr>
																				<th scope="row">
																					<label>
																						Alapértelmezett mennyiség
																					</label>
																				</th>
																				<td>
																					<Input
																						keyPath={[
																							teamId,
																							'products',
																							productId,
																							'pricingOptions',
																							k,
																							'invoiceSchemaItemGroups',
																							k2a,
																							'invoiceSchemaItems',
																							k2,
																							'defaultValue',
																						]}
																						placeholder="pl. 1"
																						isInt={true}
																						type="text"
																						className="regular-text"
																					/>
																				</td>
																			</tr>
																		</>
																	) : (
																		<tr>
																			<th scope="row">
																				<label>Mennyiség</label>
																			</th>
																			<td>
																				<Input
																					keyPath={[
																						teamId,
																						'products',
																						productId,
																						'pricingOptions',
																						k,
																						'invoiceSchemaItemGroups',
																						k2a,
																						'invoiceSchemaItems',
																						k2,
																						'quantity',
																					]}
																					placeholder="pl. 1"
																					isInt={true}
																					type="text"
																					className="regular-text"
																				/>
																			</td>
																		</tr>
																	)}
																	<tr>
																		<th scope="row">
																			<label>Kedvezményezett</label>
																		</th>
																		<td>
																			<Select
																				keyPath={[
																					teamId,
																					'products',
																					productId,
																					'pricingOptions',
																					k,
																					'invoiceSchemaItemGroups',
																					k2a,
																					'invoiceSchemaItems',
																					k2,
																					'paymentAndInvoiceRecipientId',
																				]}
																				placeholder="..."
																			>
																				{Object.entries(
																					paymentAndInvoiceRecipients ?? {}
																				).map(([key, value]) => (
																					<option value={key} key={key}>
																						{value.name}
																					</option>
																				))}
																			</Select>
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
																							'products',
																							productId,
																							'pricingOptions',
																							k,
																							'invoiceSchemaItemGroups',
																							k2a,
																							'invoiceSchemaItems',
																							k2,
																						],
																						operation: 'removeKey',
																					})
																				}}
																			>
																				Számlatétel törlése
																			</button>
																		</th>
																		<td></td>
																	</tr>
																</>
															))
													)}
											</>
										))}

									{Object.entries(pr?.pricingOptions ?? {}).length > 1 && (
										<>
											<tr>
												<th scope="row"></th>
												<td></td>
											</tr>
											<tr>
												<th scope="row">
													<label>
														Árazási opció legördülő menü megnevezése
													</label>
												</th>
												<td>
													<Input
														keyPath={[
															teamId,
															'products',
															productId,
															'pricingOptionSelectTitle',
														]}
														placeholder="pl. Érkezés"
														type="text"
														className="regular-text"
													/>
												</td>
											</tr>
										</>
									)}
									<tr>
										<th scope="row">
											<button
												className="button button-primary"
												onClick={() => {
													let id = randomString(4)
													auth.updateClientAndServer({
														keyPath: [
															teamId,
															'products',
															productId,
															'pricingOptions',
															id,
														],
														value: {
															invoiceItems: {
																[id]: {
																	ind: 0,
																	invoiceItemQuantityType: 'fix',
																	name: 'Számlatétel megnevezése',
																	paymentAndInvoiceRecipientId: Object.entries(
																		o?.paymentAndInvoiceRecipients ?? {}
																	)[0][1].name,
																	quantity: 1,
																	unit: 'db',
																	vatKey: 'AAM',
																},
															},
														},
														operation: 'setValue',
													})
												}}
											>
												Árazási opció hozzáadása
											</button>
										</th>
										<td></td>
									</tr>
								</tbody>
							</table>
						</Accordion>
						<Accordion title="Számlázás kiegészítő beállítások">
							<table className="form-table" role="presentation">
								<tbody>
									<tr>
										<th scope="row">
											<label>Számlázás engedélyezése</label>
										</th>
										<td>
											<Switch
												keyPath={[
													teamId,
													'products',
													productId,
													'enableSendInvoice',
												]}
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Közvetített szolgáltatás</label>
										</th>
										<td>
											<Switch
												keyPath={[
													teamId,
													'products',
													productId,
													'isMediatedService',
												]}
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Előleg számlázás</label>
										</th>
										<td>
											<Switch
												keyPath={[
													teamId,
													'products',
													productId,
													'isAdvancedInvoice',
												]}
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>
												Wordpressben, képeknél lévő mennyiségi szerkesztő
												engedélyezése
											</label>
										</th>
										<td>
											<Switch
												keyPath={[
													teamId,
													'products',
													productId,
													'isQuantityEditorInWordpressEnabled',
												]}
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Egy kiállított előleg számla végszámlázása</label>
										</th>
										<td>
											<Switch
												onChangePrio={async (newValue: Boolean) => {
													await fetchWithBaseUrl('sendFinalInvoices', {
														method: 'POST',
														headers: {
															'Content-Type': 'application/json',
															Authorization: `Bearer ${auth.userDTO!.token}`,
														},
														body: JSON.stringify({
															teamSlug: teamId,
															productId: productId,
															sendOnlyOneInvoice: true,
														}),
													})
													await auth.updateClientAndServer({
														keyPath: [
															teamId,
															'products',
															productId,
															'isRequiredToSendTestFinalInvoice',
														],
														value: newValue,
														operation: 'setValue',
													})
												}}
												keyPath={[
													teamId,
													'products',
													productId,
													'isRequiredToSendTestFinalInvoice',
												]}
												disabledPrio={pr?.isRequiredToSendTestFinalInvoice}
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>
												Összes kiállított előleg számla végszámlázása
											</label>
										</th>
										<td>
											<Switch
												onChangePrio={async (newValue: Boolean) => {
													await fetchWithBaseUrl('sendFinalInvoices', {
														method: 'POST',
														headers: {
															'Content-Type': 'application/json',
															Authorization: `Bearer ${auth.userDTO!.token}`,
														},
														body: JSON.stringify({
															teamSlug: teamId,
															productId: productId,
														}),
													})
													await auth.updateClientAndServer({
														keyPath: [
															teamId,
															'products',
															productId,
															'isRequiredToStartFinalInvoicing',
														],
														value: newValue,
														operation: 'setValue',
													})
												}}
												keyPath={[
													teamId,
													'products',
													productId,
													'isRequiredToStartFinalInvoicing',
												]}
												disabledPrio={pr?.isRequiredToStartFinalInvoicing}
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Számla lábléc kiegészító info</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'otherInvoiceInfo',
												]}
												placeholder="pl. egyedi bérlet"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</Accordion>
						<Accordion title="Üdvözlő e-mail">
							<table className="form-table" role="presentation">
								<tbody>
									<tr>
										<th scope="row">
											<label>Feladó e-mail címe</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'welcomeEmailSender',
												]}
												placeholder="pl. info@email.hu"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Üdvözlő e-mail tárgya</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'welcomeEmailSubject',
												]}
												placeholder="pl. Köszönjük a regisztrációt!"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Üzenet (HTML)</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'products',
													productId,
													'welcomeMessage',
												]}
												placeholder="..."
												multiLine
												className="large-text code"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</Accordion>
						<table className="form-table" role="presentation">
							<tbody>
								<tr>
									<th scope="row"></th>
									<div className="card">
										<h2 className="title">
											Szép munka!{' '}
											{missingField
												? 'Már majdnem kész is vagy'
												: 'Kész is vagy'}
										</h2>

										{missingField ? (
											<ul className="hc-cmp-text-list text-list text-list-bold    ">
												<li>
													<b>Hiányzó adat</b>
													<p>{missingField}</p>
												</li>
											</ul>
										) : (
											<></>
										)}
										<button
											className="button button-primary"
											onClick={() => {
												if (missingField && !product?.enableSale) {
													return
												}
												if (
													o?.scope?.range != 'all' &&
													!auth?.userDTO?.isTikexAdmin
												) {
													return
												}
												auth.updateClientAndServer({
													keyPath: [
														teamId,
														'products',
														productId,
														'enableSale',
													],
													value: !product?.enableSale,
													operation: 'setValue',
												})
											}}
											style={{
												backgroundColor: missingField
													? product?.enableSale
														? '#ffca00'
														: 'gray'
													: '#2271b1',
												borderColor: missingField
													? product?.enableSale
														? '#ffca00'
														: 'gray'
													: '#2271b1',
											}}
										>
											{product?.enableSale ? 'Leállítom' : 'Indítom'}
										</button>
									</div>
								</tr>
							</tbody>
						</table>
					</>
				)}
			</div>*/
