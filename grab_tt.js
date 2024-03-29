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
function gotoLoadingDiv(){
	document.querySelectorAll('[class*="DivReplyActionContainer"] [class*="SvgContainer"]')[0].scrollIntoView()
}
function scrollAllDown(after){	
	var scrollInterval = setInterval(function(){	
		var commentContainer = document.querySelector("div[class*='DivCommentListContainer']");
		if(commentContainer){
			var lastComment = commentContainer.childNodes[commentContainer.childNodes.length-1];
			lastComment.scrollIntoView();
			document.querySelectorAll("[class*='PReplyActionText']").forEach(x=>x.click());
			document.querySelectorAll("div[class*='DivActionContainer']").forEach(x=>x.remove())
		}else{
			//comments disabled or no comment
			gotoNextPage();
		}
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
		var replies=replyContainer.querySelectorAll('[class*="DivCommentContentContainer"]');
		var c=Array.from(replies).map(x=>parse(x))
		return {u,t,c,o,i};
	}
	
	return {u,t,o,i};
}
var lastGrabPercentage = -1;
var theSamePercentageCounter=0;

function checkForCommentsLoaded(){
	var actual = document.querySelectorAll("[class*='PCommentText']").length;
	var expected = document.querySelector("[data-e2e='browse-comment-count']").innerText;
	expected=parseInt(expected);
	var percent = actual/expected;
	if(percent==lastGrabPercentage){
		theSamePercentageCounter=theSamePercentageCounter+1;
	}else{
		theSamePercentageCounter=0;
		lastGrabPercentage=percent;
	}
	if(expected==0||percent>=0.95||theSamePercentageCounter>5){
		consolelog('it seems loading almost completed percentage='+percent+' lastGrabPercentage='+lastGrabPercentage+' theSamePercentageCounter='+theSamePercentageCounter);
		lastGrabPercentage=-1;
		theSamePercentageCounter=0;
		grab();
	}else{
		consolelog('grabbing percentage='+percent+' lastGrabPercentage='+lastGrabPercentage+' theSamePercentageCounter='+theSamePercentageCounter);
	}
}

function grab(){
	if(grabInterval){
		clearInterval(grabInterval);
		grabInterval=0;
	}
	grabComments();
	grabInterval = setInterval(function(){
		grab();
	},200000);
}

commentCheckInterval = setInterval(function(){
		checkForCommentsLoaded();
	},5000);
	
var tmp=console.log;
consolelog=tmp;
console.log=function(){}
console.error=function(){}
console.warn=function(){}
scrollAllDown();
var ws=new WebSocket('ws://localhost:8081');
var grabInterval=0;

grab();

	
https://qol.az/news/?name=xeber&nov=dc2022

