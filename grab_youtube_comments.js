//scroll all the way down
setInterval(function(){
	window.scrollTo(Number.MAX_VALUE,100000000);	
},1000);
//wait a bit so browser will fetch all comments while scrolling

var commentContainers = document.querySelectorAll('ytd-comment-thread-renderer');

var data = [];

function parseYTDCommentRenderer(commentContainer){
	var content = commentContainer.querySelectorAll('yt-formatted-string#content-text');
	if(content.length!=1){console.error('more than 1 content container inside a cc');}
	content=content[0];
	
	var author = commentContainer.querySelectorAll('#author-text');
	if(author.length!=1){console.error('more than 1 author container inside a cc');}
	author=author[0];
	
	var repliesContainer = commentContainer.parentComponent.querySelectorAll('#replies');
	
	//may have no replies
	if(repliesContainer.length!=1 && repliesContainer.length!=0){
		console.error('more than 1 replies container inside a cc');
	}
	if(repliesContainer.length==1){
		repliesContainer=repliesContainer[0];	
	}else{
		repliesContainer=undefined;
	}
	
	
	var dateContainer = commentContainer.querySelectorAll('.published-time-text');
	if(dateContainer.length!=1){console.error('more than 1 date container inside a cc');}
	dateContainer=dateContainer[0];
	
	var replies = [];
	if(typeof repliesContainer !=='undefined'){
		repliesContainer.querySelectorAll('ytd-comment-renderer').forEach(rc=>{
			replies.push(parseYTDCommentRenderer(rc));
		});
	}
	
	
	return {
		Author:author.innerText,
		Content:content.innerText,
		PublishDate:dateContainer.innerText,
		Replies:replies
	}
}

//replace smiley images with their unicode symbols so they will appear as text

var smileys=document.querySelectorAll('img.emoji');
smileys.forEach(smiley=>{
	var src = smiley.src.split('/').slice(-1)[0];	
	src=src.replace('emoji_u','');
	src=src.replace('.png','');
	var unicode = parseInt(src,16);
	var newNode=document.createElement('span');
	newNode.innerHTML='&#'+unicode;
	smiley.parentElement.replaceChild(newNode,smiley);
});

commentContainers.forEach(cc=>{
    cc.querySelectorAll('#dislike-button').forEach(x=>x.parentElement.remove());
	
	Array.from(cc.querySelectorAll('ytd-button-renderer#more-replies')).forEach(x=>x.click())
});

//wait a bit so browser will load all replies 
commentContainers.forEach(cc=>{
	var commentContainer = cc.querySelectorAll('ytd-comment-renderer');
	//can be multiple times because of replies
	//if(commentContainer.length!=1){console.error('more than 1 comment container inside a comment');}
	commentContainer=commentContainer[0];
	 
	var item=parseYTDCommentRenderer(commentContainer)	
	data.push(item);
});

//okay done paste this and right click copy all contents

JSON.stringify(data)
