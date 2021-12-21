let lottoArea = {
	fix : 0,
	getLottoNumbers : () => {
		let numfix = ++lottoArea.fix
		let width = 1
		while(width < 46) width*=2
		let heap = new Array(width*2)
		let i
		for(i=0;i<45;i++){
			heap[i+width] = 1
		}
		for(i=45;i<width;i++){
			heap[i+width] = 0
		}
		for(i=width-1;i>0;i--){
			heap[i] = heap[2*i] + heap[2*i + 1]
		}
		//console.log(heap)
		let ball, pos
		let answer = []
		let cnt = 45
		let order = 1
		var innerPromise
		let numberDiv = document.getElementById('numberDiv')
		numberDiv.innerHTML = ''
		var promise =  new Promise(resolve => {
			loop(resolve)
		})
		function loop(resolve){
			if(lottoArea.fix != numfix) throw 'end'
			ballIdx = Math.floor(Math.random()*cnt)+1
			pos = 1
			while(pos<width){
				pos*=2
				if(heap[pos]<ballIdx){
					ballIdx-=heap[pos]
					pos+=1
				}
			}
			let num = document.createElement('span')
			num.innerHTML = (pos-width+1)
			num.className = 'numOrder'+order
			order++
			numberDiv.appendChild(num)
			answer.push(num)
			while(pos>=1){
				heap[pos]--
				pos = Math.floor(pos/2)
			}
			cnt--
			if(cnt>=40){
				setTimeout(()=>loop(resolve), Math.random()*1000)
			}else{
				resolve(answer)
			}
		}
		
		return promise.then(res => {
			setTimeout(function(){
				let order = 1
				res.sort((a, b)=>(a.innerHTML-b.innerHTML)).forEach((num)=> {
					num.className = 'numOrder'+order++
				})
			}, Math.random()*1000)
		})
	},
}