var consoleData = {};
var networkData = {};
var systemData = {};

function loadData (file, type, fn) {
    xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.responseType = type;
    xhr.onload = function () { fn(null, this.response);};
    xhr.onerror = function () { console.error("XHR requests are not enabled, check readme on git."); };
    xhr.send();
}

loadData('Content/SystemInfo.json', 'json', function (err, data) {
	systemData = data;
	showSystemData('infoPanel');
	showSystemData('systemInfo');
});

loadData('Content/ConsoleData.json', 'json', function (err, data) {
	consoleData = data;
	appendConsoleData();
});

loadData('Content/NetworkData.json', 'json', function (err, data) {
	if(data != undefined){
		for (var i = 0; i < data.length; i++) {
			var type = data[i].type;
			var requestId = data[i].data.requestId;
			networkData[requestId + type] = data[i];
		}
	}
	appendNetworkData();
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
				div.innerHTML = '<a href="javascript:void(0);" onclick="return showNetworkData(\'' + requestId + '\');"><b class="method"> ' + networkData[keys[i]].data.request.method + '</b> - <b class="' + responseClass + '"> ' + responseCode + '</b> - ' + networkData[keys[i]].data.documentURL + '</a>';
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
	var request = networkData[requestId + 'requestWillBeSent'].data;
	try{
		var response = networkData[requestId + 'responseReceived'].data;
	}
	catch{ var response = null}
	try{
		var responseBody = networkData[requestId + 'responseBody'].data;
	}
	catch{ var responseBody = null}
	
	var mainContainer = document.getElementById("infoPanel");
	var tbl = document.createElement("table");
	tbl.setAttribute("class", "table table-bordered table-hover table-condensed br-table");
	htmlString = '<h4>General</h4><div><table class="table table-bordered table-hover table-condensed br-table"><tbody><tr><td>URL </td><td>' + request.request.url + '</td></tr></tbody></table></div>';
	htmlString += '<div><table class="table table-bordered table-hover table-condensed br-table"><tbody><tr><td>Page URL </td><td>' + request.documentURL + '</td></tr><tr><td>Method </td><td>' + request.method + '</td></tr>';
	if(response != null)
		htmlString += '<tr><td>Status </td><td>' + response.response.status + '</td></tr>';
	htmlString += '</tbody></table></div>'
	htmlString += '<div><h5>Timing</h5><table class="table table-bordered table-hover table-condensed br-table"><tbody><tr><td>Start </td><td>' + new Date(request.timestamp) + '</td></tr>'
	if(response != null)
		htmlString += '<tr><td>End </td><td>' + new Date(response.timestamp) + '</td></tr>';
	htmlString += '</tbody></table></div>'
	
	htmlString += '<h4>Request Headers</h4><div><table class="table table-bordered table-hover table-condensed br-table"><tbody>'
	Object.keys(request.request.headers).forEach(function(k){
		htmlString += '<tr><td>' + k + ' </td><td>' + request.request.headers[k] + '</td></tr>';
	});
	htmlString += '</tbody></table></div>'
	
	if(response != null){
		htmlString += '<h4>Request Cookies</h4><div>' + response.response.requestHeaders.cookie + '</div><hr/>'
		htmlString += '<h4>Response Headers</h4><div><table class="table table-bordered table-hover table-condensed br-table"><tbody>'
		Object.keys(response.response.headers).forEach(function(k){
			htmlString += '<tr><td>' + k + ' </td><td>' + response.response.headers[k] + '</td></tr>';
		});
		htmlString += '</tbody></table></div>'
		htmlString += '<h4>Response</h4><div><pre>' + syntaxHighlight(JSON.parse(responseBody.data.body)) + '</pre></div>';
	}		
	
	tbl.innerHTML = htmlString;
	mainContainer.innerHTML = "";
	mainContainer.appendChild(tbl);
}

function showSystemData(elementId){
	if(systemData.level == undefined)
		systemData.level = "Windows 10";
	var mainContainer = document.getElementById(elementId);
	var tbl = document.createElement("table");
	tbl.setAttribute("class", "table table-bordered table-hover table-condensed br-table");
	tbl.innerHTML = '<tbody><tr><td>OS </td><td>' + systemData.level + '</td></tr><tr><td>Browser </td><td>' + systemData.user_agent + '</td></tr><tr><td>Languages </td><td>' + systemData.languages[0] + ',' + systemData.languages[1] + '</td></tr><tr><td>Report Time </td><td>' + new Date(systemData.time) + '</td></tr><tr><td>Time Zone offset </td><td>' + systemData.timezone_offset + '</td></tr><tr><td>Cookies enabled </td><td>' + systemData.cookie_enabled + '</td></tr></tbody>'
	mainContainer.innerHTML = "";
	mainContainer.appendChild(tbl);
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}