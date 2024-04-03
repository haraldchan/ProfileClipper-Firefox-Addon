// dummyData = [
// 	{ room: '0001', name: 'elon' },
// 	{ room: '0002', name: 'jeff' },
// 	{ room: '0003', name: 'steve' },
// 	{ room: '0004', name: 'eric' },
// 	{ room: '0005', name: 'akio' },
// 	{ room: '0006', name: 'tim' },
// 	{ room: '0007', name: 'nick' },
// 	{ room: '0008', name: 'shohei' },
// 	{ room: '0009', name: 'mookie' },
// ]

// dummyData.map((item) => localStorage.setItem(item.room, JSON.stringify(item)))

const clipped = document.querySelector('.clipped')
const searchField = document.querySelector('.get-info')
const searchRes = document.querySelector('.searchRes')
const searchItem = document.createDocumentFragment()

function addListItem(ul, guestInfo) {
	const li = searchItem.appendChild(document.createElement('li'))
	const room = searchItem.appendChild(document.createElement('span'))
	const name = searchItem.appendChild(document.createElement('span'))
	room.innerText = `Rm: ${guestInfo.room} > `
	name.innerText = guestInfo.name
	room.style.padding = '0 10px 0'

	li.addEventListener('dblclick', () => {
		navigator.clipboard.writeText(JSON.stringify(guestInfo))
		clipped.innerText = `已复制信息 - ${guestInfo.name}`
		console.log(guestInfo)
	})
	li.classList.add('list-item')

	li.appendChild(room)
	li.appendChild(name)
	ul.appendChild(li)
}

searchField.addEventListener('change', () => {
	searchRes.innerText = ''
	for (const [key, value] of Object.entries(localStorage)) {
		try {
			guestInfo = JSON.parse(value)
		} catch {
			continue
		}
		if (guestInfo.name.includes(searchField.value) || guestInfo.room.includes(searchField.value)) {
			addListItem(searchRes, guestInfo)
		}
	}
})

browser.tabs.executeScript({ file: '/content_scripts/content.js' })
