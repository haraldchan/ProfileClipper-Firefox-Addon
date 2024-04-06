const clipped = document.querySelector('.clipped')
const searchField = document.querySelector('.get-info')
const searchRes = document.querySelector('.searchRes')
const searchItem = document.createDocumentFragment()
let ls

browser.runtime.sendMessage({ requestData: true }, response => {
	ls = response.ls
})

function addListItem(ul, guestInfo) {
	const li = searchItem.appendChild(document.createElement('li'))
	const room = searchItem.appendChild(document.createElement('span'))
	const name = searchItem.appendChild(document.createElement('span'))
	room.innerText = ` ${guestInfo.roomNum} 房： `
	name.innerText = guestInfo.guestType === '国外旅客'
		? guestInfo.nameLast + ', ' + guestInfo.nameFirst
		: guestInfo.name

	room.style.padding = '0 10px 0'

	li.addEventListener('dblclick', () => {
		navigator.clipboard.writeText(JSON.stringify(guestInfo))
		clipped.innerText = `已复制信息： ${name.innerText}`
		console.log(guestInfo)
	})
	li.classList.add('list-item')

	li.appendChild(room)
	li.appendChild(name)
	ul.appendChild(li)
}

searchField.addEventListener('input', () => {
	searchRes.innerText = ''
	for (const [key, value] of Object.entries(ls)) {
		const timestamp = parseInt(key, 10)
		if (!isNaN(timestamp)) {
			guestInfo = JSON.parse(value)

			console.log(guestInfo)
			if (guestInfo.roomNum.includes(searchField.value)) {
				addListItem(searchRes, guestInfo)
			} else if (guestInfo.guestType === '国外旅客') {
				if (guestInfo.nameLast.includes(searchField.value) ||
					guestInfo.nameFirst.includes(searchField.value)) {
					addListItem(searchRes, guestInfo)
				}
			} else if (guestInfo.guestType === '港澳台旅客') {
				if (guestInfo.nameLast.includes(searchField.value) ||
					guestInfo.nameFirst.includes(searchField.value) ||
					guestInfo.name.includes(searchField.value)) {
					addListItem(searchRes, guestInfo)
				}
			} else {
				if (guestInfo.name.includes(searchField.value)) {
					addListItem(searchRes, guestInfo)
				}
			}
		}
	}
})

browser.tabs.executeScript({ file: '/content_scripts/content.js' })
browser.tabs.executeScript({ file: '/content_scripts/handleStorage.js' })