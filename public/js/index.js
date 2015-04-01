function showAddLiveChannelDialog() {
    $("#add-live-channel-dialog").toggle();
}

function addLiveChannel() {
    // Using the core $.ajax() method
    $.ajax({
	
	// The URL for the request
	url: "http://192.168.56.21:8080/channel",
	
	// The data to send (will be converted to a query string)
	data: {
            name: "channel-001"
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
