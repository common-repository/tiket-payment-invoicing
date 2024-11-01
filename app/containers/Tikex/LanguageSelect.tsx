import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'
import { baseURL } from '../../../utils/baseURL'
import env from '../../../tikexModule/configs/env'

export default function LanguageSelect({ teamId }: { teamId: string }) {
	const [lang, setLang] = useLocalStorage<string>(
		'lang',
		window.navigator.language.slice(0, 2) || 'en'
	)
	const [translations, setTranslations] = useLocalStorage<{
		[textId: string]: { [lang: string]: string }
	}>('translations', {})
	const [translationLastUpdate, setTranslationLastUpdate] = useLocalStorage<
		string | null
	>('translationLastUpdate', null)
	const [languages, setLanguages] = useLocalStorage<[string] | null>(
		'languages',
		null
	)

	const handleClick = (language: string) => {
		setLang(language)
		const myEvent = new CustomEvent('languageChanged', { detail: language })
		window.dispatchEvent(myEvent)
	}

	useEffect(() => {
		const fetchTranslations = async () => {
			try {
				const response = await axios.get(baseURL(env) + `translations`, {
					params: {
						teamId,
					},
				})
				setTranslations(response.data.translations)
				setLanguages(response.data.languages)
				setTranslationLastUpdate(Date.now().toString())
			} catch (error) {
				console.error(error)
			}
		}

		const currentTime = Date.now()
		const twentyFourHours = 24 * 60 * 60 * 1000

		if (
			teamId &&
			(!translations ||
				!translationLastUpdate ||
				currentTime - parseInt(translationLastUpdate) > twentyFourHours)
		) {
			fetchTranslations()
		}
	}, [translations])

	return (
		<ul className="nav navbar-nav lan-menu" style={{ padding: 0 }}>
			<li className="dropdown">
				<a
					href="#"
					className="dropdown-toggle"
					data-toggle="dropdown"
					role="button"
				>
					<img
						alt="flag"
						src={`http://themes.framework-y.com/codrop/chat/wp-content/plugins/sitepress-multilingual-cms/res/flags/${lang}.png`}
					/>
					{lang} <span className="caret" />
				</a>
				<ul
					className="dropdown-menu fade-in"
					style={{
						animationDuration: '250ms',
						transitionTimingFunction: 'ease',
						transitionDelay: '0ms',
					}}
				>
					{languages?.map((language) => (
						<li key={language}>
							<a
								onClick={() => handleClick(language)}
								style={{ position: 'relative' }}
							>
								<img
									alt="flag"
									src={`http://themes.framework-y.com/codrop/chat/wp-content/plugins/sitepress-multilingual-cms/res/flags/${language}.png`}
								/>
								{language}
							</a>
						</li>
					))}
				</ul>
			</li>
		</ul>
	)
}
