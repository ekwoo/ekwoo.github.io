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
			subDiv.style.zIndex='10000';
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
		goCurrentPage();
	};
	window.addEventListener('load', init);
		
	function goCurrentPage(){
		let params = new URLSearchParams(document.location.search);
		let menu = params.get('menu');
		if(menu){
			loadPage(menu, menu.substring(menu.lastIndexOf('/')+1));
		}
	}
	
	/**
	 * 이름을 받아서 해당화면을 띄운다.
	 * 띄우는 방식은 template, js css를 꽂아주는식..
	 * 캐시는 브라우저가 해 주지 않을까?
	 */
	async function loadPage(pagePath, pageId){
		let path = '/menu/'+pagePath+'/'+pageId;
		
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
	
	main.goto = (arr)=>{
		let pagePath = arr.join('%2F');
		history.pushState('/', '',  window.location.pathname+'?menu='+pagePath);
		loadPage(pagePath, arr[arr.length-1]);
	}
	
	window.onpopstate = (event) => {
		if(event.state != null){	//event가 null이면 hash change임
			goCurrentPage();
		}
	};
}