// enable your browser to automatically select torrent client without asking on link click before executing this
var aList=document.getElementsByTagName('a');
console.log(aList.length);
for(var i=0;i<aList.length;i++)
{
  if(alar[i].href.startsWith("magnet:"))
  {
	 //console.log(alar[i]);
	 var windowName="name"+i;
	 window.open(alar[i].href, windowName, "height=200,width=200");	
  }
}
