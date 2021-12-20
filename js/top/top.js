/**
 * 상단의 메뉴 
 */
{
	window.onload = () => {
		/**
		 * 상단 메뉴 목록 - 이거는 메뉴추가할때마다 늘려줘야함..
		 */
		let topMenuList = ['algo', 'tools']
		
		topMenuList.forEach((item) => {
			sendRequest('./js/top/'+item+'.json')
			.then(res => {
				addMenu(item, res)
			})
		})
	}
	
	function addMenu(name, sub){
		let top = document.getElementById('top')
		let a = document.createElement('a')
		a.innerHTML = name
		let subUl = document.createElement('ul')
		subUl.style.maxHeight='0'
		Object.keys(sub).forEach((key) => {
			let subLi = document.createElement('li')
			subLi.innerHTML = sub[key]
			subUl.appendChild(subLi)
		})
		a.appendChild(subUl)
		a.onmouseover = () => {subUl.style.maxHeight = '100px'}
		a.onmouseout = () => {subUl.style.maxHeight = '0'}
		top.appendChild(a)
	}
	
}