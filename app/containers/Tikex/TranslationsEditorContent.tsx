import React, { useEffect, useState } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import { useAuth } from '../../../tikexModule/hooks/useAuth'
import randomString from '../../../tikexModule/utils/randomString'
import Accordion from '../../components/Accordion'
import Input from '../../../tikexModule/components/inputs/Input'

export default function TranslationsEditorContent({
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
	const translations = organization?.translations ?? {}
	const languages = organization?.languages ?? []
	const [newLanguageCode, setNewLanguageCode] = useState<string>('')

	const handleAddLanguage = () => {
		if (newLanguageCode) {
			auth.updateClientAndServer({
				keyPath: [teamId, 'languages'],
				operation: 'push',
				value: newLanguageCode,
			})
			setNewLanguageCode('')
		} else {
			alert('Adj meg egy új nyelv kódját pl. kh')
		}
	}

	const handleAddTranslation = () => {
		const id = randomString(4)
		const translation: { [languageCode: string]: string } = {}
		languages.forEach((language) => {
			translation[language] = ''
		})
		auth.updateClientAndServer({
			keyPath: [teamId, 'translations', id],
			operation: 'setValue',
			value: translation,
		})
	}

	if (auth.userDTO) {
		return (
			<div className="wrap">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-start',
					}}
				>
					<h1>Fordítások</h1>
				</div>
				<div>
					<p>
						Nyelvválasztó shortcode, amit pl. egyedi menüben tudsz elhelyezni
						pl. Divi &gt; Theme Builder használatával:{' '}
						<code>
							[tikex_language_select organization_short_id="
							{teamId}"]
						</code>
					</p>
				</div>
				<table className="form-table" role="presentation">
					<tbody>
						<tr>
							<th scope="row">
								<label>Új Nyelv kódja</label>
							</th>
							<td>
								<div
									style={{
										display: 'flex',
										gap: '1rem',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<input
										type="text"
										value={newLanguageCode}
										onChange={(e) => {
											setNewLanguageCode(e.target.value)
										}}
										className="regular-text"
										placeholder="pl. hu vagy en"
									/>
									<button
										className="button button-primary"
										onClick={handleAddLanguage}
									>
										Új Nyelv hozzáadása
									</button>
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label>Nyelvek</label>
							</th>
							<td>
								<div
									style={{
										display: 'flex',
										gap: '1rem',
										alignItems: 'center',
										justifyContent: 'flex-start',
									}}
								>
									{languages
										.sort((a, b) => a?.localeCompare(b))
										.map((language, i) => (
											<button
												className="button button-primary"
												onClick={(e) => {
													auth.updateClientAndServer({
														keyPath: [teamId, 'languages', i],
														operation: 'removeKey',
													})
												}}
											>
												{language}
											</button>
										))}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<button
						className="button button-primary"
						onClick={handleAddTranslation}
					>
						Új Fordítás hozzáadása
					</button>
				</div>
				<div className="wrap">
					{Object.entries(translations ?? {})
						.sort((a, b) => a[0][0]?.localeCompare(b[0][0]))
						.map(([translationKey, translationObject]) => (
							<Accordion title={translationKey} key={translationKey}>
								<table className="form-table" role="presentation">
									<tbody>
										<tr>
											<th scope="row">
												<label>Shortcode</label>
											</th>
											<td>
												<code>
													[tikex_translation text_id="{translationKey}"]
												</code>
											</td>
										</tr>
									</tbody>
								</table>
								{Object.values(languages).map((languageCode) => (
									<div>
										<table className="form-table" role="presentation">
											<tbody>
												<tr>
													<th scope="row">
														<label>{languageCode}</label>
													</th>
													<td>
														<Input
															keyPath={[
																teamId,
																'translations',
																translationKey,
																languageCode,
															]}
															type="text"
															className="regular-text"
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								))}
								<button
									className="button button-primary"
									onClick={() =>
										auth.updateClientAndServer({
											keyPath: [teamId, 'translations', translationKey],
											operation: 'removeKey',
										})
									}
								>
									Fordítás törlés
								</button>
							</Accordion>
						))}
				</div>
			</div>
		)
	} else if (auth.isUpdateUserDTOCompleted) {
		return <>{children}</>
	} else {
		return <></>
	}
}
