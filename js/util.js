/**
 * 유틸성
 */
{
	
	let addParameterToUrl = (url, paramObj) => {
		let urlParam = []
		Object.keys(paramObj).forEach(key => {
			urlParam.push(key+"="+encodeURIComponent(paramObj[key]))
		})
		if(urlParam.length>0){
			let hashIdx = url.indexOf('#')
			let hash
			if(hashIdx >= 0){
				hash = url.substring(hashIdx)
				url = url.substring(0, hashIdx)
			}
			let urlparamStr
			if(url.indexOf('&')>=0){
				urlparamStr='?'
			}else{
				urlparamStr='&'
			}
			urlparamStr+=urlParam.join('&')
			url +=urlparamStr+hash
			return url
		}
	}

	/**
	 * 서버로 요청을 날리고 그 결과를 json으로 밭기
	 * @param {string} url 요청URL
	 * @param {object} body 요청내용
	 * @param {object} options fetch 옵션
	 * @return {Promise} promise response를 파라미터로 넘기는 promise
	 */
	let getResponse = (url, body, options) => {
		if(!options) options = {}
		if(!options.method) options.method = 'GET'
		options.method = options.method.toUpperCase()
		if(options.method != 'GET' && options.method != 'HEAD') {
			options.body = JSON.stringify(body)
		} else if (body){
			url = addParameterToUrl(url, body)
		}
		return fetch(url, options)
		.then((response) => {
			if(response.status == 200){
				return response
			}else{
				throw new Error('request fail['+response.status+']', {cause: response.error})
			}
			
		})
		.catch((error) => {
			if(!options.throwError){
				console.error('error occurs during requests.', error)
				alert('sorry, request failed. please try again.')
			}else{
				throw error
			}
		})
	}
	
	/**
	 * 서버로 요청을 날리고 그 결과를 json으로 밭기
	 * @param {string} url 요청URL
	 * @param {object} body 요청내용
	 * @param {object} options fetch 옵션
	 * @return {Promise} promise 응답 json을 파라미터로 넘기는 promise
	 */
	let sendRequest = (url, body, options) => {
		return getResponse(url, body, options)
		.then((response) => {
			return response.json()
		})
	}
	window.sendRequest = sendRequest
	/**
	 * 서버로 요청을 날리고 그 결과를 text으로 밭기
	 * @param {string} url 요청URL
	 * @param {object} body 요청내용
	 * @param {object} options fetch 옵션
	 * @return {Promise} promise 응답 template을 파라미터로 넘기는 promise
	 */
	let getTemplate = (url, body, options) => {
		return getResponse(url, body, options)
		.then((response) => {
			return response.text()
		})
	}
	window.getTemplate = getTemplate
}