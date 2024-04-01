const identifier = '04047fce826f48f751891b4721f7ac70' // MD5 hash: ProfileModifyNext
const newGuestModalParent = document.querySelector('body')

const observer = new MutationObserver(async (mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
			const submitSpan = Array.from(document.getElementsByTagName('span'))
			const submitBtn = submitSpan.filter(span => span.innerText === "上报(R)")[0].parentElement

			const nameLabel = document.querySelector('label[for="xm"]')
			const genderLabel = document.querySelector('label[for="xb"]')
			const birthdayLabel = document.querySelector('label[for="csrq"]')
			const addrLabel = document.querySelector('label[for="czdz"]')
			const idTypeLabel = document.querySelector('label[for="idType"]')
			const idNumLabel = document.querySelector('label[for="idCode"]')
			const roomNumLabel = document.querySelector('label[for="fjh"]')

			if (!submitBtn.hasAttribute('capture-event-added')) {
				submitBtn.addEventListener("click", async () => {
					const guestInfo = {identifier: identifier}

					guestInfo.name = nameLabel.nextElementSibling.getElementsByTagName('input')[0].value
					guestInfo.gender = genderLabel.nextElementSibling.getElementsByTagName('input')[0].value
					guestInfo.birthday = birthdayLabel.nextElementSibling.getElementsByTagName('input')[0].value
					guestInfo.address = addrLabel.nextElementSibling.getElementsByTagName('input')[0].value
					guestInfo.idType = idTypeLabel.nextElementSibling.getElementsByTagName('input')[0].value
					guestInfo.idNum = idNumLabel.nextElementSibling.getElementsByTagName('input')[0].value
					guestInfo.roomNum = roomNumLabel.nextElementSibling.getElementsByTagName('input')[0].value

					console.log(guestInfo)
					navigator.clipboard.writeText(JSON.stringify(guestInfo))
					localStorage.setItem((new Date()).getTime(), JSON.stringify(guestInfo))
				})

				document.addEventListener('keyup', e => {
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