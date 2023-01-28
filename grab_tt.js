function getVideoId(){
	var tmp = document.URL.split('/');
	tmp=tmp[tmp.length-1];
	if(tmp.indexOf('?')>0){
		tmp = tmp.split('?')[0]
	}
	return tmp;
}
function gotoNextPage(){
	document.querySelectorAll('[data-e2e="arrow-right"]')[0].click();
}

function scrollAllDown(after){	
	var scrollInterval = setInterval(function(){	
		var commentContainer = document.querySelector("div[class*='DivCommentListContainer']");
		var lastComment = commentContainer.childNodes[commentContainer.childNodes.length-1];
		lastComment.scrollIntoView();
		document.querySelectorAll("[class*='PReplyActionText']").forEach(x=>x.click());
	},3000);
}



function grabComments(){
	var commentCountTotal = document.querySelector("[data-e2e='browse-comment-count']").innerText;
	if(commentCountTotal=='0'){
		gotoNextPage();
		return;
	}
	document.querySelectorAll("[class*='PReplyActionText']").forEach(x=>x.click());
	var commentContainer = document.querySelector("div[class*='DivCommentListContainer']");
	document.querySelectorAll("div[class*='DivActionContainer']").forEach(x=>x.remove())
	var data = Array.from(commentContainer.childNodes).map(x=>parse(x));
	ws.send(JSON.stringify(data));
	gotoNextPage();	
}



function parse(c){
	var replyContainer = c.querySelector("[class*='DivReplyContainer']");
	var textContainer = c.querySelector("[class*='PCommentText']");
	var usernameContainer = c.querySelector("[class*='StyledUserLinkName']");
	var ownerContainer= document.querySelector("[class*='DivInfoContainer']");
	if(!usernameContainer){
		return {};
	}
	if(!textContainer){
		return {};
	}
	if(!ownerContainer){
		return {};
	}
	var owner = ownerContainer.querySelector("[data-e2e='browse-username']");
	
	
	var o=owner.innerText;
	var i=getVideoId();
	var u=usernameContainer.innerText;	
	var t=textContainer.innerText;
	
	if(replyContainer){
		var c=parse(replyContainer);
		return {u,t,c,o,i};
	}
	
	return {u,t,o,i};
}


scrollAllDown();
var ws=new WebSocket('ws://localhost:8081');
var grabInterval=0;

function grab(){
	if(grabInterval){
		clearInterval(grabInterval);
	}
	grabComments();
	grabInterval = setInterval(function(){
		grab();
	},200000);
}

grab();
