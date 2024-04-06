const identifier = '04047fce826f48f751891b4721f7ac70' // MD5 hash: ProfileModifyNext
const newGuestModalParent = document.querySelector('body')
const fieldLabelPatterns = {
	mainland: {
		name: 'xm',
		gender: 'xb',
		birthday: 'csrq',
		addr: 'czdz',
		idType: 'idType',
		idNum: 'idCode',
		roomNum: 'fjh',
	},
	hkMoTw: {
		name: 'xm',
		gender: 'xb',
		birthday: 'csrq',
		addr: 'czdz',
		idType: 'cardType',
		idNum: 'cardId',
		region: 'region',
		roomNum: 'fjh',
	},
	foreign: {
		nameLast: 'wwx',
		nameFirst: 'wwm',
		gender: 'xb',
		birthday: 'csrq',
		country: 'country',
		idType: 'foreignCardType',
		idNum: 'cardId',
		roomNum: 'fjh',
	},
}

function getFormattedDateTime() {
	const date = new Date()
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function cleanLocalStorage() {
	const currentTime = new Date().getTime()
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		const timestamp = parseInt(key, 10) // Parse the key as an integer
		if (!isNaN(timestamp)) {
			// Check if the key is a valid timestamp
			if (currentTime - timestamp >= 24 * 60 * 60 * 1000) {
				// Check if the timestamp is older than 24 hours
				localStorage.removeItem(key) // Remove the item from local storage
			}
		}
	}
}

function getGuestInfo(guestType) {
	const guestInfo = { identifier, guestType }

	patternToApply =
		guestType === '内地旅客' ? fieldLabelPatterns.mainland
			: guestType === '港澳台旅客' ? fieldLabelPatterns.hkMoTw
				: fieldLabelPatterns.foreign

	for (const [key, val] of Object.entries(patternToApply)) {
		guestInfo[key] = document.querySelector(`label[for="${val}"]`).nextElementSibling.getElementsByTagName('input')[0].value
	}

	if (guestType === '港澳台旅客') {
		guestInfo.nameLast = Array.from(document.querySelectorAll('.el-form-item__label'))
			.filter(label => label.innerText === '英文姓')[0]
			.nextElementSibling
			.querySelector('input').value
		guestInfo.nameFirst = Array.from(document.querySelectorAll('.el-form-item__label'))
			.filter(label => label.innerText === '英文名')[0]
			.nextElementSibling
			.querySelector('input').value
	}

	return guestInfo
}

const observer = new MutationObserver(async (mutationsList, observer) => {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			// when button appear means the modal is show
			const span = Array.from(document.getElementsByTagName('span'))
			const submitBtn = span.filter((span) => span.innerText === '上报(R)')[0].parentElement
			const guestTypes = Array.from(span.filter((span) => span.innerText === '内地旅客')[0].parentElement.parentElement.querySelectorAll('.el-radio'))

			if (!submitBtn.hasAttribute('capture-event-added')) {
				submitBtn.addEventListener('click', () => {
					const currentGuestType = guestTypes.filter((radio) => radio.classList.contains('is-checked'))[0].textContent
					console.log(currentGuestType)

					const guestInfo = getGuestInfo(currentGuestType)
					console.log(guestInfo)

					navigator.clipboard.writeText(JSON.stringify(guestInfo))
					localStorage.setItem(new Date().getTime(), JSON.stringify(guestInfo))
					// cleanLocalStorage()
				})

				document.addEventListener('keyup', (e) => {
					if (e.ctrlKey && e.key === 'r') {
						submitBtn.click()
					}
				})
				submitBtn.setAttribute('capture-event-added', 'true')
			}
		}
	}
})

observer.observe(newGuestModalParent, { childList: true })