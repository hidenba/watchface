var xhrRequest = function(url, type, callback){
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess(pos) {
  var api_key = '183440bc909b8fdb2d855c8dc84c58cf';
  var lat = pos.coords.latitude;
  var lon = pos.coords.longitude;
  var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + api_key;

  xhrRequest(url, 'GET', function(responseText) {
    var json = JSON.parse(responseText);
    var temperature = Math.round(json.main.temp - 273.15);
    console.log('Temp: ' + temperature);

    var conditions = json.weather[0].main;
    console.log('Conditions are ' + conditions);

    var dictionary = {
      'KEY_TEMPERATURE': temperature,
      'KEY_CONDITIONS': conditions
    };

    Pebble.sendAppMessage(dictionary, 
                           function(e){
                             console.log('Wearher info sent to Pebble successfully');
                           }, 
                           function(e){
                             console.log('Error sending weather info to Pebble');
                           });
  });
}

function locationError(err) {
  console.log('Error requesting location');
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, mmaximumAge: 60000}
  );
}

Pebble.addEventListener('ready', function(e){
  console.log('PebbleKot JS ready');

  getWeather();
});

Pebble.addEventListener('appmessage', function(e){
  console.log('AppMessage received');

  getWeather();
});

