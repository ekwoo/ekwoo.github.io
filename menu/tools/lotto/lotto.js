function random(start, end){
	if(!end){
		end = start
		start = 0
	}
	if(!end){
		end = 1
	}
	//console.log(start+" "+end)
	return Math.floor((window.crypto || window.msCrypto).getRandomValues(new Uint32Array(1))[0]/4294967296*(end-start) + start)
}

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
		let order = 1
		let cnt = 45
		var innerPromise
		let numberDiv = document.getElementById('numberDiv')
		numberDiv.textContent = ''
		var promise =  new Promise(resolve => {
			loop(resolve)
		})
		function loop(resolve){
			if(lottoArea.fix != numfix) throw 'end'
			let ballIdx = random(1, cnt+1)
			pos = 1
			while(pos<width){
				pos*=2
				if(heap[pos]<ballIdx){
					ballIdx-=heap[pos]
					pos+=1
				}
			}
			let number = pos-width+1;
			let numSpan = document.createElement('span')
			numSpan.textContent = number
			numSpan.range = Math.floor(number/10)*10;
			numSpan.className = 'numOrder'+order+" numColor"+numSpan.range
			order++
			numberDiv.appendChild(numSpan)
			answer.push(numSpan)
			while(pos>=1){
				heap[pos]--
				pos = Math.floor(pos/2)
			}
			cnt--
			if(cnt>=40){
				setTimeout(()=>loop(resolve), random(1000))
			}else{
				resolve(answer)
			}
		}
		
		return promise.then(res => {
			setTimeout(function(){
				let order = 1
				res.sort((a, b)=>(a.textContent-b.textContent)).forEach((numSpan)=> {
					numSpan.className = 'numOrder'+order++ +" numColor"+numSpan.range
				})
			}, random(1000))
		})
	},
}
window.lottoArea = lottoArea