moduleHelper.loadModuleCss('board');
let template = await moduleHelper.getModuleTemplate('board');

const pagingSize = 7;
const naviSize = 7;

//게시글은 마크다운을 사용해서 글을 쓰자..
showdown.extension('codehighlight', function() {
	  function htmlunencode(text) {
	    return (
	      text
	        .replace(/&amp;/g, '&')
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	      );
	  }
	  return [
	    {
	      type: 'output',
	      filter: function (text, converter, options) {
	        // use new shodown's regexp engine to conditionally parse codeblocks
	        var left  = '<pre><code\\b[^>]*>',
	            right = '</code></pre>',
	            flags = 'g',
	            replacement = function (wholeMatch, match, left, right) {
	              // unescape match to prevent double escaping
	              match = htmlunencode(match);
	              let language = /class="([^ "]*)/.exec(left)[1];
	              return '<pre><div class="languageLabel">'+language+'</div><code class="hljs '+language+' language-'+language+'">' + hljs.highlight(match, {language:language}).value + right;
	            };
	        return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
	      }
	    }
	  ];
	});

const converter = new showdown.Converter({ extensions: ['codehighlight'] });
converter.setOption('simpleLineBreaks', true);

/**
 * 게시판
 */
export default class Board {
	/**
	 * 생성자.
	 * 
	 * @param {element|string}	el				게시판을 꽂을 element. id를 주면 일단 찾긴하는데, 그냥 element를 주는게 좋을듯.
	 * @param {object}			options			추가옵션..
	 * @param {string}			options.name	게시판이름
	 * @param {string}			options.id		게시판 ID
	 */
	constructor(el, options){
		this.el = el;
		this.options = options;
		this.articleMap = null;
		this.entry = null;
		
		//페이징
		this.total = 0;
		this.currentArticle = null;
		this.currentPage = 0;
		
		if(typeof el == 'string'){
			el = document.getElementById(el);
		}
		el.innerHTML = template;
		
		let titleDiv = el.querySelector('#name');
		titleDiv.textContent = options.name;
		
		common.sendRequest('/article/'+options.id+'/list.json')
		.then((articleMap)=>{
			this.articleMap = articleMap;
			let entry = Object.entries(this.articleMap);
			this.el.querySelector('#articleTotalCnt').textContent = this.total = entry.length;
			//번호붙이기
			entry.forEach((entry, idx) => {
				const [id, article] = entry;
				article.idx = idx;
			});
			this.el.querySelector('#pagenator>#goFirst').onclick=()=>{
				this.currentPage = 0;
				this.showList();
			};
			this.el.querySelector('#pagenator>#goFront').onclick=()=>{
				const currentNavi = Math.floor(this.currentPage/naviSize);
				this.currentPage = currentNavi * naviSize - 1;
				this.showList();
			};
			this.el.querySelector('#pagenator>#goBack').onclick=()=>{
				const currentNavi = Math.floor(this.currentPage/naviSize);
				this.currentPage = (currentNavi+1) * naviSize;
				this.showList();
			};
			this.el.querySelector('#pagenator>#goLast').onclick=()=>{
				this.currentPage = Math.floor(this.total/pagingSize);
				this.showList();
			};
			//url에 게시글 지정 시 바로 이동
			let params = new URLSearchParams(document.location.search);
			this.currentArticle = params.get('article');
			if(this.currentArticle != null && this.articleMap[this.currentArticle] != null){
				this.currentPage = Math.floor(this.articleMap[this.currentArticle].idx/pagingSize)
				this.openArticle(this.currentArticle, this.articleMap[this.currentArticle].title);
			}else{
				this.showList();
			}
		});
	}
	
	/**
	 * 게시글 리스트를 뿌려준다.
	 * @param {list}	articleList	게시글 목록
	 */
	showList(){	
		const totalPage = Math.ceil(this.total/pagingSize);

		const currentNavi = Math.floor(this.currentPage/naviSize);
		const lastNavi = Math.floor(totalPage/naviSize);

		if(currentNavi==0){
			this.el.querySelector('#pagenator>#goFirst').className = 'disabled';
			this.el.querySelector('#pagenator>#goFront').className = 'disabled';
		}else{
			this.el.querySelector('#pagenator>#goFirst').className = '';
			this.el.querySelector('#pagenator>#goFront').className = '';
		}
		if(currentNavi == lastNavi){
			this.el.querySelector('#pagenator>#goLast').className = 'disabled';
			this.el.querySelector('#pagenator>#goBack').className = 'disabled';
		}else{
			this.el.querySelector('#pagenator>#goLast').className = '';
			this.el.querySelector('#pagenator>#goBack').className = '';
		}
		
		let pageIdx = currentNavi * naviSize;
		const pageEnd = Math.min((currentNavi+1) * naviSize, totalPage);
		const pagingDiv = this.el.querySelector('#pagenator>#pageList');
		pagingDiv.innerHTML = '';
		let a;
		for(;pageIdx<pageEnd;pageIdx++){
			a = document.createElement('a');
			a.textContent = pageIdx+1;
			if(pageIdx == this.currentPage){
				a.className = 'active';
			}
			const idx = pageIdx;
			a.onclick = () => {
				this.currentPage = idx;
				this.showList();
			}
			pagingDiv.appendChild(a)
		}
		
		// 현제 페이지의 게시글 목록 뿌리기
		let articleIdx = this.currentPage*pagingSize;
		const articleEnd = Math.min((this.currentPage+1)*pagingSize, this.total);
		
		const entries = Object.entries(this.articleMap);
		const tbody = this.el.querySelector('#articleList>table>tbody');
		tbody.innerHTML = '';
		let tr, td;
		for(;articleIdx<articleEnd;articleIdx++){
			const [id, article] = entries[articleIdx];
			tr = document.createElement('tr');
			td = document.createElement('td');
			td.textContent = article.title;
			tr.appendChild(td);
			td = document.createElement('td');
			td.textContent = article.date;
			tr.appendChild(td);
			tr.onclick=()=>{
				this.openArticle(id, article.title);
				window.scrollTo(0, 0);
				var searchParams = new URLSearchParams(window.location.search)
				searchParams.set('article', id);
				history.pushState(null, '', window.location.pathname+'?'+searchParams.toString());
			};
			if(id == this.currentArticle){
				tr.className = 'active';
			}
			tbody.appendChild(tr);
		}
	}
	/**
	 * 선택한 게시글 을 보여준다.
	 * @param {string}	articleId		보여줄 게시글 ID
	 * @param {string}	articleTitle	보여줄 게시글 이름
	 */
	async openArticle(articleId, articleTitle){
		this.currentArticle = articleId;
		this.el.querySelector('#articleTitle').textContent = articleTitle;
		this.el.querySelector('#articleContent').innerHTML = '';
		try{
			let template = await common.getTemplate('/article/'+this.options.id+'/'+articleId+'.content');
			this.el.querySelector('#articleContent').innerHTML = converter.makeHtml(template);
		}finally{
			this.showList();
		}
	}
}