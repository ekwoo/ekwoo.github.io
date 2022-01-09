/**
 * 모듈로드관련
 */
{
	if(!window.moduleHelper) window.moduleHelper = {};
	
	let getModuleTemplate = (moduleName) => {
		return common.getTemplate('/modules/'+moduleName+'/'+moduleName+'.template');
	}
	window.moduleHelper.getModuleTemplate = getModuleTemplate;
	
	let loadModuleCss = (moduleName) => {
		if(!document.getElementById(moduleName+'Css')){
			var link = document.createElement('link');
			link.rel = 'stylesheet'; 
			link.type = 'text/css';
			link.href = '/modules/'+moduleName+'/'+moduleName+'.css';
			link.id = moduleName+'Css'
			document.head.appendChild(link); 
		}
	}
	window.moduleHelper.loadModuleCss = loadModuleCss;
}