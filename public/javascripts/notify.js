var eventsource = new EventSource('/slackevent/api');

eventsource.onmessage = function (event) {
    document.getElementById("notification").innerHTML = event.data;
};