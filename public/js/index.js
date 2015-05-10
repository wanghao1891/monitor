function showAddLiveChannelDialog() {
    $("#add-live-channel-dialog").toggle();
}

function showChannels(json) {
    console.log("json: " + json);
    var _list = "監控首頁<br>";
    
    json.forEach(function(e){
	_list += "<div id='"+ e.name + "' class='live-channel'>" + e.name + "</div>";
    });

    console.log(_list);

    $("#live-channel-list-div").html(_list);
}

function getLiveChannels() {
    // Using the core $.ajax() method
    $.ajax({
	
	// The URL for the request
	url: "/channels",
	
	// The data to send (will be converted to a query string)
	data: {
            //name: $("#live-channel-name").val(),
	    //bitrate: $("#live-channel-bitrate").val()
	},
	
	// Whether this is a POST or GET request
	type: "GET",
	
	// The type of data we expect back
	dataType : "json",
	
	// Code to run if the request succeeds;
	// the response is passed to the function
	success: function( json ) {
	    
	    showChannels(json);

//            $( "<h1>" ).text( json.title ).appendTo( "body" );
//            $( "<div class=\"content\">").html( json.html ).appendTo( "body" );
	},
	
	// Code to run if the request fails; the raw request and
	// status codes are passed to the function
	error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
	},
	
	// Code to run regardless of success or failure
	complete: function( xhr, status ) {
            //alert( "The request is complete!" );
	}
    });
}

function addLiveChannelTmp() {
    $.post("/channel", {number: 1});
}

function addLiveChannel() {
    // Using the core $.ajax() method
    $.ajax({
	
	// The URL for the request
	url: "/channel",
	
	// The data to send (will be converted to a query string)
	data: {
            name: $("#live-channel-name").val(),
	    bitrate: $("#live-channel-bitrate").val()
	},
	
	// Whether this is a POST or GET request
	type: "POST",
	
	// The type of data we expect back
	dataType : "json",
	
	// Code to run if the request succeeds;
	// the response is passed to the function
	success: function( json ) {
	    console.log("json: " + json);
//            $( "<h1>" ).text( json.title ).appendTo( "body" );
//            $( "<div class=\"content\">").html( json.html ).appendTo( "body" );
	},
	
	// Code to run if the request fails; the raw request and
	// status codes are passed to the function
	error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
	},
	
	// Code to run regardless of success or failure
	complete: function( xhr, status ) {
            //alert( "The request is complete!" );
	}
    });
}

function connectSocketIO() {
    var socket = io('http://192.168.56.21:8080');
    socket.on('news', function (data) {

	var name = data.channel;
	var status = data.status;

//	if(status === "Good" && (name === "1000000000000051" || name === "1000000000000036")) {
//	    status = "Bad";
//	}
	
	var color = "#2CB853";
	
	if(status === "Bad") {
	    color = "#B82C41";
	}

	$("#" + name).css("background-color", color);

	console.log(data, Date.now());
	socket.emit('my other event', { my: 'data' });
    });
}
