var map, infoWindow;
var app = new AppViewModel();

/*
  function to init the map with Google Maps API and
   update the localStorage with current position
*/
function initMap() {
  var storageState = localStorage.getItem("state");
  var state = (storageState === null) ? {lat: -22.9020102, lng: -43.2562987, zoom: 12} : JSON.parse(storageState);

  function updateState() { 
    var newState = {lat: map.getCenter().lat(), lng: map.getCenter().lng(), zoom: map.getZoom()};
    localStorage.setItem('state', JSON.stringify(newState));
  }

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: state.zoom, 
    center: {lat: state.lat, lng: state.lng},
    disableDefaultUI: true,
  });

  infoWindow = new google.maps.InfoWindow({maxWidth: 250});
  infoWindow.addListener('closeclick', function() {
    Place.prototype.active.deactivate();
  });

  map.addListener('dragend', updateState);
  map.addListener('zoom_changed', updateState);

  ko.applyBindings(app);  
  app.isMapLoaded(true);
}

/*
  If an error occurs when loading map, trigger this function
*/
function errorMap() {
  ko.applyBindings(app);
  app.message('An error occurred when loading the map');
}

