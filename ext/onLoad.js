console.log("IM STILL HERE");

defualtHD(document);
var video = document.getElementById("my_video_1_html5_api");
video.pause();
//wait 2000ms b4 closing ads to avoid procking the adblockker
window.setTimeout(closeBannerAds, 2000);

function defualtHD(currentDocument){
	var selector = document.getElementById("selectQuality");
	for(var i = 0; i<selector.options.length; i++){
		if (selector.options[i].text === "1080p"){
			selector.selectedIndex = i;
			console.log("1080p Selected!")
			break;
		}
	}
}
function closeBannerAds(){
	var element = document.getElementsByClassName("divCloseBut");
	console.log("TEST: " + element.length)
	var elementLength = element.length
	while(element.length > 0){
		var descendant = document.getElementsByClassName("divCloseBut")[0].getElementsByTagName('a');
		descendant[0].click();
		console.log("CLICK_CLOSED");
	}
}



//_________________________________________________
//Everything below this line is D/L attempts
//_________________________________________________



chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "videoUrlPlz"){
			sendResponse({farewell: video.src});
			
			//download currentPage
			//var video = document.getElementById("my_video_1_html5_api");
			//saveLink(video.src, "TEST");
			//console.log("ADDED: " + video.src);
			
			//getAllLinksForShow();
			downloadWholeSeries();
			console.log("Message Sent!");
		}
		
});


//Need to fix fileName not working

function saveLink(fileLink, fileName){
	var link = document.createElement('a');
	//link.download = fileName;
	//link.setAttribute("download", "PINGASWALL");
	link.download = "PINGASWAFFLE"
	link.href = fileLink;
	link.click();
	console.log(link.download);
}


/*
function saveLink(fileLink, fileName){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', fileLink, true);
	xhr.responseType = 'blob';
	
	chrome.downloads.download(fileLink);
}
*/

/*
function saveLink(fileLink, fileName){
	chrome.downloads.download({
		url: fileLink,
		filename: fileName // Optional
	});
}
*/
//var url = "http://static.zerochan.net/Rem.(Re%3AZero).full.2004507.jpg";
//saveLink(url, "BLUE_BATTLE_MAID");



function downloadWholeSeries(){
	getHTMLFirstPage(window.location.href);
}

//getHTMLFirstPage(window.location.href);
function getHTMLFirstPage(currentURL){
	var currentHTML;
	var request = makeHttpObject();
	request.open("GET", currentURL, true);
	request.send(null);
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			currentHTML = request.responseText;
			
			var i = currentHTML.indexOf("btnPrevious");
			if(i == -1){
				downloadSeries(currentURL);
				return;
			}
			while(true){
				if(currentHTML.substring(i,i+4) == 'http')
					break
				else
					i--;
			}
			var btnPreviousLink = "";
			while(currentHTML[i] != '"'){
				btnPreviousLink += currentHTML[i];
				i++;
			}
			console.log("PREVIOUS PAGE LINK: " + btnPreviousLink);
			getHTMLFirstPage(btnPreviousLink);
		}
	}
}

function downloadSeries(currentURL){
	var currentHTML;
	var request = makeHttpObject();
	request.open("GET", currentURL, true);
	request.send(null);
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			//Gets the html of the current page
			currentHTML = request.responseText;
			
			//find and construct downloadLink
			var i = currentHTML.indexOf("1920x1080");
			if(i == -1)
				i = currentHTML.indexOf("12820x720");
			if(i == -1)
				i = currentHTML.indexOf("854x480");
			if(i == -1)
				i = currentHTML.indexOf("640x360");
			if(i == -1){
				console.log("ERROR: No download link available");
				return;
			}
			while(true){
				if(currentHTML.substring(i,i+4) == 'http')
					break;
				else
					i--;
			}
			var downloadLink = "";
			while(currentHTML[i] != '"'){
				downloadLink += currentHTML[i];
				i++;
			}
			console.log("Download Link: " + downloadLink);
			saveLink(downloadLink, "IsItWorkingYet");
			
			//finds and constructs the link to the next page
			i = currentHTML.indexOf("btnNext");
			if(i == -1){
				//recursive base case when no btnNext exists
				return;
			}
			while(true){
				if(currentHTML.substring(i,i+4) == 'http')
					break
				else
					i--;
			}
			var btnNextLink = "";
			while(currentHTML[i] != '"'){
				btnNextLink += currentHTML[i];
				i++;
			}
			console.log("NEXT PAGE LINK: " + btnNextLink);
			
			//recursive call
			//500ms delay to avoid triggering CAPTCHA check
			window.setTimeout(downloadSeries(btnNextLink), 1000);
		}
	}
}

function getHTMLOfPage(URL){
	var request = makeHttpObject();
	request.open("GET", URL, true);
	request.send(null);
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			console.log(request.responseText);
			return request.responseText;
		}
	};
}

function makeHttpObject() {
	try{
		return new XMLHttpRequest();
	}catch(error){
	}try{
		return new ActiveXObject("Msxml2.XMLHTTP");
	}catch (error){		
	}
	try{
		return new ActiveXObject("Microsoft.XMLHTTP");
	}catch (error){
	}
	throw new Error("Could not create HTTP request object.");
}