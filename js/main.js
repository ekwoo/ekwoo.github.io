/**
 * 화면 전체 구조에 대한 영역
 */
{
	if(!window.main) window.main = {};
	let content;
	let contentCss;
	let init = () => {
		content = document.getElementById('content');
		contentCss = document.getElementById('contentCss');	//이거 왜 필요없지..
		window.removeEventListener('load', init);
		
		let params = new URLSearchParams(document.location.search);
		let menu = params.get('menu');
		if(menu){
			let arr = menu.split('/');
			goto(arr);
		}
		
		/**
		 * 상단 메뉴 목록 - 이거는 메뉴추가할때마다 늘려줘야함..
		 */
		let topMenuList = ['study', 'tools'];
		let topEl = document.getElementById('top');
		
		topMenuList.forEach((item) => {
			let topDiv = document.createElement('div');
			topDiv.textContent = item;
			let subDiv = document.createElement('div');
			topDiv.appendChild(subDiv);
			let subUl = document.createElement('ul');
			subDiv.appendChild(subUl);
			subDiv.style.maxHeight='0';
			topDiv.onmouseover = () => {subDiv.style.maxHeight = subUl.offsetHeight+10+'px'};
			topDiv.onmouseout = () => {subDiv.style.maxHeight = '0'};
			topEl.appendChild(topDiv);
			common.sendRequest('./json/menu/'+item+'.json')
			.then(res => {
				Object.keys(res).forEach(function(key){
					let subLi = document.createElement('li');
					subLi.textContent = res[key];
					subUl.appendChild(subLi);
					subLi.onclick = function(){
						subDiv.style.maxHeight = '0';
						main.goto([item, key]);
					}
				});
			});
		});
	};
	window.addEventListener('load', init);
	
	/**
	 * 메뉴추가
	 */
	function addMenu(name, sub){
	};
	
	/**
	 * 이름을 받아서 해당화면을 띄운다.
	 * 띄우는 방식은 template, js css를 꽂아주는식..
	 * 캐시는 브라우저가 해 주지 않을까?
	 */
	async function goto(arr){
		let path = '/menu/'+arr.join('/')+'/'+arr[arr.length-1];
		
		let cssPath = path+'.css';
		contentCss.href = cssPath;
		
		let temaplatePath = path+'.template';
		content.innerHTML = await common.getTemplate(temaplatePath);
		
		let jsPath = path+'.js';
		
		import(jsPath)
		.then(page => {
			if(page.init){
				page.init();
			}
		});
	};
	
	main.goto = goto;
}