if (!!window.EventSource) {
    var eventsource = new EventSource('http://lucasying.com/slackevent/api');

    eventsource.addEventListener('message', function(event) {
        // votes = JSON.parse(event.data);
        document.getElementById("notification").innerHTML = JSON.parse(event.data);
        console.log("message: " + event.data);
    }, false);

    eventsource.addEventListener('open', function(event) {
        document.getElementById("state").innerHTML = "Connected";
        console.log("Connection was opened");
    }, false);

    eventsource.addEventListener('error', function(event) {
        if (event.target.readyState == EventSource.CLOSED) {
            document.getElementById("state").innerHTML = "Disconnected";
            console.log("Connection was closed");
        }
        else if (event.target.readyState == EventSource.CONNECTING) {
            document.getElementById("state").innerHTML = "Connecting...";
            console.log("Connecting...");
        }
    }, false);
} else {
    console.log("Your browser doesn't support SSE")
}