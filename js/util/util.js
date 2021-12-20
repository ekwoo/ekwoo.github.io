/**
 * 유틸성
 */
{
	/**
	 * 서버로 요청을 날리고 그 결과를 json으로 밭기
	 * @param {string} url 요청URL
	 * @param {object} body 요청내용
	 * @param {object} options fetch 옵션
	 * @return {Promise} promise 응답이후 처리를 위한 promise
	 */
	function sendRequest(url, body, options){
		options = options || {}
		if(!options.method) options.method = 'GET'
		if(options.method.toUpperCase() == 'GET') options.body = JSON.stringify(body)
		else {
			let urlParam = []
			Object.keys(body).forEach(key => {
				urlParam.push(key+"="+encodeURIComponent(object[key]))
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
			}
		}
		return fetch(url, options)
		.then((response) => {
			if(response.status == 200){
				return response.json()
			}else{
				console.error('request fail['+response.status+']', response.error)
				alert('sorry, request failed. please try again.')
			}
			
		})
		.catch((error) => {
			console.error('error occurs during requests.', error)
			alert('sorry, request failed. please try again.')
		})
	}
	window.sendRequest = sendRequest
}