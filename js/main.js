/**
 * 화면 전체 구조에 대한 영역
 */
const main = {}
{
	let content
	let contentScript
	let init = () => {
		content = document.getElementById('content')
		contentScript = document.getElementById('contentScript')
		contentCss = document.getElementById('contentCss')	//이거 왜 필요없지..
		window.removeEventListener('load', init)
	}
	
	window.addEventListener('load', init)
	
	/**
	 * 이름을 받아서 해당화면을 띄운다.
	 * 띄우는 방식은 template, js css를 꽂아주는식..
	 * 로딩한 js나 css가... 빠지긴 하나..?
	 */
	async function goto(arr, name){
		let path = '/top'
		arr.forEach((next) => {path+='/'+next})
		path+='/'+name
		
		
		let csspath = path+'.css'
		contentCss.href = csspath
		
		let temaplatepath = path+'.template'
		content.innerHTML = await getTemplate(temaplatepath)
		
		let jspath = path+'.js'
		contentScript.src = jspath
	}
	
	main.goto = goto
}