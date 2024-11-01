import React, { useEffect } from 'react'
import useLocalStorage from '../../../tikexModule/hooks/useLocalStorageTX'

export default function Translation({
	textId,
	className,
}: {
	textId: string
	className: string
}) {
	const [translations, setTranslations] = useLocalStorage<{
		[textId: string]: { [lang: string]: string }
	}>('translations', {})
	const [lang, setLang] = useLocalStorage<string>('lang', 'en')

	useEffect(() => {
		window.addEventListener('languageChanged', (event: any) => {
			setLang(event.detail)
		})
		return () => {
			window.removeEventListener('languageChanged', () => {})
		}
	}, [])

	return (
		<p id={textId} className={className}>
			{translations?.[textId]?.[lang] ?? 'na'}
		</p>
	)
}
