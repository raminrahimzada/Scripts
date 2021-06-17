setInterval(function(){
	window.scrollTo(Number.MAX_VALUE,100000000);	
},1000);
var rendererArray = document.querySelectorAll('ytd-rich-item-renderer[class*=ytd-rich-grid-renderer]');
data=[]
for(var i=0;i<rendererArray.length;i++)
{	
	renderer=rendererArray[i];
	//properties
	var id = renderer.querySelector('a[id=thumbnail]');
	//skip ads.
	if(!id) continue;
	id=id.href
	id=id.replace('https://www.youtube.com/watch?v=','');
	var title  = renderer.querySelector('yt-formatted-string[id=video-title]').innerText;
	var author = renderer.querySelector('yt-formatted-string[id=text]').innerText;
	var metadata = Array.from(renderer.querySelectorAll('span[class*=style-scope]')).map(x=>x.innerText.trim()).filter(x=>x);
	var verifiedChannel = renderer.querySelectorAll('yt-icon[class*=ytd-badge-supported-renderer]>svg').length; 
	//console.log(title);
	//console.log(author);
	//console.log(metadata);
	//console.log(verifiedChannel);
	data.push({id,title,author,metadata,verifiedChannel})
	//break;
}
console.log(data);


function toSQL(d){	
	var id=d.id;
	if(id.indexOf('&')>0)
	{
		id=id.substring(0,id.indexOf('&'));
	}
	var title=d.title;	
	var author=d.author;
	title=title.replaceAll("'","''");
	author=author.replaceAll("'","''");
	var duration=d.metadata[0];
	var viewsCount=d.metadata[1];
	var oldState=d.metadata[2];
	var verifiedChannel=d.metadata[3];
	return `INSERT INTO [dbo].[Youtube]
([id],[title],[author],[duration],[viewsCount],[oldState],[verifiedChannel])
VALUES
('${id}',N'${title}',N'${author}',N'${duration}',N'${viewsCount}',N'${oldState}',N'${verifiedChannel}');`;
}


var sql='';
for(var i=0;i<data.length;i++)
{
	sql+=toSQL(data[i]);
}
console.clear();
console.log(sql);



//select author ,count(1) from Youtube group by author order by count(1) desc

