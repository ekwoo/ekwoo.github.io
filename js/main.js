/**
 * 화면 전체 구조에 대한 영역
 */
const main = {}
{
	let content
	let contentScript
	window.addEventListener('load', () => {
		content = document.getElementById('content')
		contentScript = document.getElementById('contentScript')
	})
	function goto(arr){
		let path = '/templates'
		arr.forEach((next) => {path+='/'+next})
		path+='.template'
		getTemplate(path)
		.then(res => {
			content.innerHTML = res
		})
		
		let jspath = '/js'
		arr.forEach((next) => {jspath+='/'+next})
		jspath+='.js'
		contentScript.src = jspath
		
		let csspath = '/css'
		arr.forEach((next) => {csspath+='/'+next})
		csspath+='.css'
		contentCss.href = csspath
		
	}
	main.goto = goto
}