import Board from '/modules/board/board.js'

export function init(){
	new Board(document.getElementById('articleArea'), {
		name : 'Linux',
		id : 'linux',
	});
}