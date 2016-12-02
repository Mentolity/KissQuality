document.getElementById("downloadBtn").addEventListener("click", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {greeting: "videoUrlPlz"}, function(response) {
			//var link = response.farewell;
			//saveLink(link, "PINGAS");
			
			console.log(response.farewell);
		});
	});
});

function saveLink(fileLink, fileName){
	var link = document.createElement('a');
	link.download = fileName;
	link.href = fileLink;
	link.click();
}
