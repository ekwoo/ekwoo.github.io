let template
getTemplate(temaplatepath)
.then((res)=> template = res)


if(!document.getElementById('boardCss')){
	var head = document.getElementsByTagName('HEAD')[0];
	var link = document.createElement('link');
	link.rel = 'stylesheet'; 
	link.type = 'text/css';
	link.href = 'style.css';
	link.id = 'boardCss'
	head.appendChild(link); 
}

export default class Board {
	constructor(el){
		if(typeof el == 'string'){
			el = document.getElementById(el)
		}
	}
}