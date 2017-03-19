/*
  Place Model to handle with places data, markers and windows
*/
function Place(obj) {
  var self = this;

  // Defining Place properties
  self.id = obj.id;
  self.lat = obj.latitude;
  self.lng = obj.longitude;
  self.location = new google.maps.LatLng({lat: self.lat, lng: self.lng});
  self.name = obj.name;
  self.address = obj.address;
  self.website = obj.website;

  // Defining visible property as observable
  self.visible = ko.observable(true);

  // Instantiating the InfoWindow
  self.infoWindow = new google.maps.InfoWindow({maxWidth: 250});

  // Instantiating the Marker
  self.marker = new google.maps.Marker({
    map: map,
    position: self.location
  });

  /*
    setVisible method toggle the visibility
  */
  self.setVisible = function(value) {
    self.deactivate();
    self.visible(value);
    self.marker.setVisible(value);
  };

  /* 
    showWindow method to set content of InfoWindow and renders it
  */
  self.showWindow = function() {
    var content = '<strong>' + self.name + '</strong><br>';
        content += self.address;
        if(typeof self.website !== 'undefined')
          content += '<br><br><a href="' + self.website + '" target="_blank">' + self.website + '</a>';

    self.infoWindow.setContent(content);
    self.infoWindow.open(map, self.marker);
  };

  /*
    activate method to open InfoWindow, add animation and deactivate
    all others markers
  */
  self.activate = function() {
    self.showWindow();
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    map.panTo(self.location);

    if (Place.prototype.active && Place.prototype.active !== self) {
      Place.prototype.active.deactivate();
    }

    Place.prototype.active = self;
  };

  /*
    deactivate method to close InfoWindow and remove animation
  */
  self.deactivate = function() {
    self.marker.setAnimation(null);
    self.infoWindow.close();

    Place.prototype.active = null;
  };

  /*
    closeHandler method with behaviours when InfoWindow is closed
  */
  self.closeHandler = function() {
      self.deactivate();
  };

  /*
    openHandler method with behaviours when Place is selected
  */
  self.openHandler = function() {

    if(Place.prototype.active === self) {
      self.deactivate();
    } else {
      self.activate();
    }

  };

  self.marker.addListener('click', self.openHandler);
  self.infoWindow.addListener('closeclick', self.closeHandler);

}

// Setting an static property to allow only one Place active at time
Place.prototype.active = null;

/*
  AppViewModel
*/
function AppViewModel() {
  var self = this;

  // Defining properties
  self.places = ko.observableArray([]);
  self.isLoading = ko.observable(true);
  self.search = ko.observable('');

  /*
    clickHandler method to activate the Place when 
    it's selected from search list
  */
  self.clickHandler = function(obj) {
    obj.activate();
  };

  /*
    seachResult method to display only the results
    which corresponds the search terms
  */
  self.searchResult = ko.computed(function() {
    self.places().forEach(function(place) {
      if(place.name.toLowerCase().indexOf(self.search().toLowerCase() ) >= 0) {
        place.setVisible(true);
      } else {
        place.setVisible(false);
      }
    });
  });

  // XMLHttpRequest to get the JSON data with all places
  var getPlaces = new XMLHttpRequest();
  getPlaces.open('GET', 'js/data.json');
  getPlaces.onreadystatechange = function() {
    if (getPlaces.readyState === XMLHttpRequest.DONE) {
      if (getPlaces.status === 200) {
        JSON.parse(getPlaces.responseText).forEach(function(data) {
          self.places.push(new Place(data));
        });
        self.isLoading(false);
      }
    }
  }
  getPlaces.send();
}

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