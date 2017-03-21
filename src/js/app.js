/*
  function to init the map with Google Maps API and
   update the localStorage with current position
*/
function initMap() {
  var storageState = localStorage.getItem('state');
  var state = (storageState === null) ? {lat: -22.9020102, lng: -43.2562987, zoom: 12} : JSON.parse(storageState);

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: state.zoom, 
    center: {lat: state.lat, lng: state.lng},
    disableDefaultUI: true,
  });

  function updateState() { 
    var newState = {lat: map.getCenter().lat(), lng: map.getCenter().lng(), zoom: map.getZoom()};
    localStorage.setItem('state', JSON.stringify(newState));
  }

  map.addListener('dragend', updateState);
  map.addListener('zoom_changed', updateState);

  ko.applyBindings(new AppViewModel());
}

var map;