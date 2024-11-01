import axios from 'axios'
import getTempUserShortId from '../../../tikexModule/utils/getTempUserId'

export const getJwt = () => {
	const jwt = localStorage.getItem('jwt')
	return jwt
}

export const FEUrl = 'https://tiket.hu'
/* https://tiket.hu */

export const setURLs = (setBEUrl, setFBAppId, setFEUrl) => {
	if (setFBAppId) {
		setFBAppId(localStorage.getItem('fbAppId'))
	}
	if (setBEUrl) {
		setBEUrl(localStorage.getItem('BEUrl'))
	}
	if (setFEUrl) {
		setFEUrl(localStorage.getItem('FEUrl'))
	}
}

export const responseFacebook = (responseFB) => {
	if (responseFB.accessToken === undefined) {
		return
	}
	const BEUrl = localStorage.getItem('BEUrl')
	const fbAppId = localStorage.getItem('fbAppId')
	axios({
		method: 'post',
		url: BEUrl + 'registerUser',
		data: {
			accessToken: responseFB.accessToken,
			photoUrl: responseFB.picture.data.url,
			tempUserShortId: getTempUserShortId(),
			userName: responseFB.name,
			appId: fbAppId,
		},
		headers: { 'Content-Type': 'application/json', crossDomain: true },
	})
		.then((responseBE) => {
			if (!responseBE.data.error) {
				if (localStorage.getItem('userNameLoggedIn') === null) {
					window.location.reload()
				}
				localStorage.setItem('jwt', responseBE.data.token)
				localStorage.setItem('userFbId', responseFB.userID)
				localStorage.setItem('userNameLoggedIn', responseFB.name)
			}
		})
		.catch(function (error) {
			localStorage.removeItem('userFbId')
			localStorage.removeItem('userNameLoggedIn')
			if (error.response) {
				console.error(error.response.data.error.message)
			}
		})
}

export const logOut = () => {
	localStorage.removeItem('userFbId')
	localStorage.removeItem('userNameLoggedIn')
	localStorage.removeItem('jwt')
	window.location.reload()
}

export const callBuyticket = (eventId, code) => {
	const BEUrl = localStorage.getItem('BEUrl')
	const tempUserShortId = getTempUserShortId()
	let url =
		BEUrl +
		`programTickets?programId=${eventId}&tempUserShortId=${tempUserShortId}&code={code}`
	return axios({
		method: 'get',
		url: url,
		headers: { 'Content-Type': 'application/json', crossDomain: true },
	})
}

// TODO: Make Utility.js to TSX.
// Q: Mi a data típusa?
export const startPayment = (data, allowNewTab) => {
	const BEUrl = localStorage.getItem('BEUrl')
	const tempUserShortId = getTempUserShortId()
	let url = BEUrl + 'startPayment/'
	let barionWindow
	const jwt = getJwt()
	const headers = {
		'Content-Type': 'application/json',
		crossDomain: true,
	}

	if (jwt) {
		headers.Authorization = `Bearer ${jwt}`
	}
	if (allowNewTab) {
		let id = new Date().getTime()
		barionWindow = window.open(
			window.location.href,
			'_blank',
			'toolbar=1,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=800,height=600,left = 240,top = 212'
		)
	}
	if (!data.invoiceItems && !data.quantity) {
		data.quantity = 1
	}
	axios({
		method: 'post',
		url: url,
		data: { ...data, tempUserShortId },
		headers: headers,
	})
		.then((data) => {
			localStorage.removeItem('formFieldData')
			localStorage.removeItem('buyTicketData')
			localStorage.removeItem('needFormFieldCheck')
			localStorage.removeItem('selectedEventTimes')
			localStorage.removeItem('quantitys')

			// Q: Ez itt mire jó?
			for (let key in localStorage) {
				if (key.substring(0, 12) == 'invoiceItems') {
					localStorage.removeItem(key)
				}
			}
			if (data.data.GatewayUrl) {
				if (allowNewTab) {
					barionWindow.location.replace(data.data.GatewayUrl)
				} else {
					window.location.replace(data.data.GatewayUrl)
				}
			}
		})
		.catch((err) => console.error(err))
}

export const getInvoiceDetails = async () => {
	const BEUrl = localStorage.getItem('BEUrl')
	let jwt = await getJwt()
	return axios.get(BEUrl + `getInvoiceDetailsAndEmail/`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	})
}

export const applyForParticipation = (eventId) => {
	const BEUrl = localStorage.getItem('BEUrl')
	let url = BEUrl + 'applyForParticipation/'
	let data = {
		eventId: eventId,
	}
	return axios({
		method: 'post',
		url: url,
		data: data,
		headers: {
			'Content-Type': 'application/json',
			crossDomain: true,
			Authorization: `Bearer ${getJwt()}`,
		},
	})
}

export const getFaceCheckAndPaymentOut = (eventId) => {
	const BEUrl = localStorage.getItem('BEUrl')
	let url = BEUrl + 'getFaceCheckAndPayment/'
	let data = {
		eventId: eventId,
	}
	return axios({
		method: 'post',
		url: url,
		data: data,
		headers: {
			'Content-Type': 'application/json',
			crossDomain: true,
			Authorization: `Bearer ${getJwt()}`,
		},
	})
}

export const loadSelectedVariant = (eventId, setter, generator) => {
	let lastSelectedPictureId = JSON.parse(
		localStorage.getItem('selectedVariant') ?? '{}'
	)?.[eventId]
	console.log(lastSelectedPictureId)
	if (lastSelectedPictureId) {
		setter(generator(lastSelectedPictureId))
	}
}
