import React, { useEffect, useState } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import {
	InvoiceProvider,
	SzamlazzhuVatKey,
} from '../../../tikexModule/Types/dto/team'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import randomString from '../../../tikexModule/utils/randomString'
import Input from '../../../tikexModule/components/inputs/Input'
import Select from '../../../tikexModule/components/inputs/Select'
import Switch from '../../../tikexModule/components/inputs/Switch'
import Accordion from '../../components/Accordion'

export default function PayeesEditorContent({
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
	const paymentAndInvoiceRecipients = organization?.paymentAndInvoiceRecipients

	if (auth.userDTO) {
		return (
			<div className="wrap">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<h1>Kedvezményezettek</h1>
					<button
						className="button button-primary"
						onClick={() => {
							auth.updateClientAndServer({
								keyPath: [
									teamId,
									'paymentAndInvoiceRecipients',
									randomString(4),
								],
								operation: 'setValue',
								value: {
									name: '',
									barionId: '',
									szamlazzhuSzamlaAgentKulcs: '',
								},
							})
						}}
					>
						Kedvezményezett hozzáadása
					</button>
				</div>
				<br />
				{false && (
					<p>
						A számlázási tételek beállításánál a kedvezményezett kiválasztásához
						szükséges, hogy a kedvezményezett megnevezése és Barion azonosítója
						is meg legyen adva.
					</p>
				)}
				<table className="form-table" role="presentation">
					<tbody>
						{Object.entries(paymentAndInvoiceRecipients ?? {})?.map(
							([key, paymentAndInvoiceRecipient]) => (
								<>
									<tr>
										<th scope="row">
											<label>
												Név <span style={{ color: 'red' }}>*</span>
											</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'paymentAndInvoiceRecipients',
													key,
													'name',
												]}
												placeholder="pl. me"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>
												Barion ID <span style={{ color: 'red' }}>*</span>
											</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'paymentAndInvoiceRecipients',
													key,
													'barionId',
												]}
												placeholder="Barion ID"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Számlázz.hu számla agent kulcs</label>
										</th>
										<td>
											<Input
												keyPath={[
													teamId,
													'paymentAndInvoiceRecipients',
													key,
													'szamlazzhuSzamlaAgentKulcs',
												]}
												placeholder="Számlázz.hu számla agent kulcs"
												type="text"
												className="regular-text"
											/>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<label>Előlegszámlázás tiltása</label>
										</th>
										<td>
											<Switch
												keyPath={[
													teamId,
													'paymentAndInvoiceRecipients',
													key,
													'isAdvancedInvoicingForbidden',
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
															'paymentAndInvoiceRecipients',
															key,
														],
														operation: 'removeKey',
													})
												}}
											>
												Törlés
											</button>
										</th>
										<td></td>
									</tr>
								</>
							)
						)}
					</tbody>
				</table>
				<Accordion title="Bérlet kedvezményezett">
					<table className="form-table" role="presentation">
						<tbody>
							<tr>
								<th scope="row">
									<label>Barion ID</label>
								</th>
								<td>
									<Input
										keyPath={[teamId, 'barionId']}
										placeholder="Barion ID"
										disabled={organization?.isLocked}
										type="text"
										className="regular-text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Barion POS kulcs</label>
								</th>
								<td>
									<Input
										keyPath={[teamId, 'barionPOSKey']}
										placeholder="Barion POS kulcs"
										disabled={organization?.isLocked}
										type="text"
										className="regular-text"
									/>
								</td>
							</tr>
							{false && (
								<tr>
									<th scope="row">
										<label>Számlázási szolgáltató</label>
									</th>
									<td>
										<Select
											keyPath={[teamId, 'selectedInvoiceProvider']}
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
							)}
							<tr>
								<th scope="row">
									<label>Számlázz.hu számla agent kulcs</label>
								</th>
								<td>
									<Input
										keyPath={[teamId, 'szamlazzhuSzamlaAgentKulcs']}
										placeholder="Számlázz.hu számla Agent Kulcs..."
										disabled={organization?.isLocked}
										type="text"
										className="regular-text"
									/>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label>Számlázz.hu Áfa kulcs</label>
								</th>
								<td>
									<Select
										keyPath={[teamId, 'szamlazzhuVatKey']}
										disabled={organization?.isLocked}
									>
										{Object.entries(SzamlazzhuVatKey).map(([key, value]) => (
											<option value={value} key={key}>
												{value}
											</option>
										))}
									</Select>
								</td>
							</tr>
						</tbody>
					</table>
				</Accordion>
			</div>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}
