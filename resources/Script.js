var consoleData = {};
var networkData = {};
var systemData = {};

fetch('Content/SystemInfo.json')
  .then(function (response) {
	return response.json();
  })
  .then(function (data) {
	systemData = data;
	showSystemData('infoPanel');
	showSystemData('systemInfo');
  })
  .catch(function (err) {
	console.log(err);
});

fetch('Content/ConsoleData.json')
  .then(function (response) {
	return response.json();
  })
  .then(function (data) {
	consoleData = data;
	appendConsoleData();
  })
  .catch(function (err) {
	console.log(err);
});

fetch('Content/NetworkData.json')
  .then(function (response) {
	return response.json();
  })
  .then(function (data) {
	if(data != undefined){
		for (var i = 0; i < data.length; i++) {
			var type = data[i].type;
			var requestId = data[i].data.requestId;
			networkData[requestId + type] = data[i];
		}
	}
	appendNetworkData();
  })
  .catch(function (err) {
	console.log(err);
});

function appendConsoleData() {
	if(consoleData.console_logs != undefined){
		var mainContainer = document.getElementById("consoleLogs");
		for (var i = 0; i < consoleData.console_logs.length; i++) {
			if(consoleData.console_logs[i].level != undefined){
			  var div = document.createElement("div");
				div.innerHTML = '<a href="javascript:void(0);" onclick="return showConsoleData(' + i + ');">' + consoleData.console_logs[i].text + '</a>';
				mainContainer.appendChild(div);
				var hr = document.createElement("hr");
				mainContainer.appendChild(hr);
			}
		}
	}
}

function appendNetworkData() {
	if(networkData != undefined){
		var mainContainer = document.getElementById("networkTraffic");
		var keys = Object.keys(networkData);
		for (var i = 0; i < keys.length; i++) {
			if(networkData[keys[i]].type === 'requestWillBeSent'){
				var requestId = networkData[keys[i]].data.requestId;
				responseClass = 'responseWarning';
				try{
					var response = networkData[requestId + 'responseReceived'].data;
					var responseCode = response.response.status;
					if(responseCode < 300){
						responseClass = 'responseSuccess';
					}
					else if(responseCode < 400){
						responseClass = 'responseWarning';
					}
					else if(responseCode < 500){
						responseClass = 'responseError';
					}
				}
				catch{ var responseCode = ""}				
				
				var div = document.createElement("div");
				div.innerHTML = '<a href="javascript:void(0);" onclick="return showNetworkData(' + requestId + ');"><b class="method"> ' + networkData[keys[i]].data.request.method + '</b> - <b class="' + responseClass + '"> ' + responseCode + '</b> - ' + networkData[keys[i]].data.documentURL + '</a>';
				mainContainer.appendChild(div);
				var hr = document.createElement("hr");
				mainContainer.appendChild(hr);
			}
		}
	}
}

function showConsoleData(index){
	var data = consoleData.console_logs[index];
	var mainContainer = document.getElementById("infoPanel");
	var tbl = document.createElement("table");
	tbl.setAttribute("class", "table table-bordered table-hover table-condensed br-table");
	tbl.innerHTML = '<tbody><tr><td>Level </td><td>' + data.level + '</td></tr><tr><td>Source </td><td>' + data.source + '</td></tr><tr><td>Text </td><td>' + data.text + '</td></tr><tr><td>Time </td><td>' + data.timestamp + '</td></tr><tr><td>Url </td><td>' + data.url + '</td></tr></tbody>'
	mainContainer.innerHTML = "";
	mainContainer.appendChild(tbl);
}

function showNetworkData(requestId){
	try{
		var request = networkData[requestId + 'requestWillBeSent'].data;
	}
	catch{ var request = ""}
	try{
		var response = networkData[requestId + 'responseReceived'].data;
	}
	catch{ var response = ""}
	try{
		var responseBody = networkData[requestId + 'responseBody'].data;
	}
	catch{ var responseBody = ""}
	
	var mainContainer = document.getElementById("infoPanel");
	var tbl = document.createElement("table");
	tbl.setAttribute("class", "table table-bordered table-hover table-condensed br-table");
	tbl.innerHTML = '<h4>General</h4><div><h5>URL</h5><table class="table table-bordered table-hover table-condensed br-table"><tbody><tr><td>' + request.request.url + '</td></tr></tbody></table></div>'
	mainContainer.innerHTML = "";
	mainContainer.appendChild(tbl);
}

function showSystemData(elementId){
	var mainContainer = document.getElementById(elementId);
	var tbl = document.createElement("table");
	tbl.setAttribute("class", "table table-bordered table-hover table-condensed br-table");
	tbl.innerHTML = '<tbody><tr><td>OS </td><td>' + systemData.level + '</td></tr><tr><td>Browser </td><td>' + systemData.user_agent + '</td></tr><tr><td>Languages </td><td>' + systemData.languages[0] + ',' + systemData.languages[1] + '</td></tr><tr><td>Report Time </td><td>' + new Date(systemData.time) + '</td></tr><tr><td>Time Zone offset </td><td>' + systemData.timezone_offset + '</td></tr><tr><td>Cookies enabled </td><td>' + systemData.cookie_enabled + '</td></tr></tbody>'
	mainContainer.innerHTML = "";
	mainContainer.appendChild(tbl);
}