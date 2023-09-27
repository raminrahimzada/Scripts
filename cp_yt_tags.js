function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
function flat(arr){
	return arr.reduce(function(a, b){ return a.concat(b); }, []);
}
function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}
function isLetter(ch){
	if(ch>='a' && ch<='z')return true;
  //russian letters
	if(ch>=String.fromCharCode(1040) && ch<=String.fromCharCode(1071))return true;
	if(ch>=String.fromCharCode(1072) && ch<=String.fromCharCode(1103))return true;
	if(ch>='A' && ch<='Z')return true;
	if(ch=='ç'|| ch == 'Ç') return true;
	if(ch=='ş'|| ch == 'Ş') return true;
	if(ch=='ı'|| ch == 'I') return true;
	if(ch=='ə'|| ch == 'Ə') return true;
	if(ch=='ö'|| ch == 'Ö') return true;
	if(ch=='ğ'|| ch == 'Ğ') return true;
	if(ch=='ü'|| ch == 'Ü') return true;
	if(ch=='i'|| ch == 'İ') return true;
	if(ch=='ṣ') return true;
	return false;
}
function extractWords(text){
	text=text.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
	var chars=text.split('').filter(onlyUnique);
	chars=chars.filter(t=>!isLetter(t));
	text=text.toLowerCase()
	var arr=text.split('\n');
	for(var i=0;i<chars.length;i++){
		var ch=chars[i];
		arr=arr.map(t=>t.split(ch));
		arr=flat(arr);
	}
	arr=arr.filter(t=>t!='');
	arr=arr.filter(t=>t.length>3);
	return arr;
}

var t1=Array.from(document.querySelectorAll('.metadata-snippet-text')).map(t=>t.innerText).join(' ')
var t2=Array.from(document.querySelectorAll('#video-title')).map(t=>t.innerText).join(' ')

var text=[t1,t2].join(' ');
 
var arr=extractWords(text);
 

var group=Object.groupBy(arr, x => {
  return x;
});
var words=Object.keys(group);
var stats=words.map(function(t){
    return {word:t,count:group[t].length}
});
var keywords=stats.sort((a,b)=>b.count-a.count).map(t=>t.word).slice(0,50);
keywords.join(',')
