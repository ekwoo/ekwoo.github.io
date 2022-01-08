/**
 * 상단의 메뉴 
 */
{
	window.addEventListener('load', () => {
		/**
		 * 상단 메뉴 목록 - 이거는 메뉴추가할때마다 늘려줘야함..
		 */
		let topMenuList = ['study', 'tools']
		
		topMenuList.forEach((item) => {
			sendRequest('./json/top/'+item+'.json')
			.then(res => {
				addMenu(item, res)
			})
		})
	})
	
	function addMenu(name, sub){
		let topEl = document.getElementById('top')
		let topDiv = document.createElement('div')
		topDiv.innerHTML = name
		let subDiv = document.createElement('div')
		topDiv.appendChild(subDiv)
		let subUl = document.createElement('ul')
		subDiv.appendChild(subUl)
		subDiv.style.maxHeight='0'
		Object.keys(sub).forEach(function(key){
			let subLi = document.createElement('li')
			subLi.innerHTML = sub[key]
			subUl.appendChild(subLi)
			subLi.onclick = function(){
				subDiv.style.maxHeight = '0'
				main.goto([name, key], key)
			}
		})
		topDiv.onmouseover = () => {subDiv.style.maxHeight = subUl.offsetHeight+10+'px'}
		topDiv.onmouseout = () => {subDiv.style.maxHeight = '0'}
		topEl.appendChild(topDiv)
	}
	
}