function Place(obj) {
  var self = this;
  self.id = obj.id;
  self.lat = obj.latitude;
  self.lng = obj.longitude;
  self.location = new google.maps.LatLng({lat: self.lat, lng: self.lng});
  self.name = obj.name;
  self.address = obj.address;
  self.website = obj.website;
  self.visible = ko.observable(true);

  self.infoWindow = new google.maps.InfoWindow();

  self.marker = new google.maps.Marker({
    map: map,
    position: self.location
  });

  self.setVisible = function(value) {
    self.visible(value);
    self.marker.setVisible(value);
  };

  self.showWindow = function() {
    var content = '<strong>' + self.name + '</strong><br>';
        // content += self.address;
        if(typeof self.website !== 'undefined')
          content += '<br><br><a href="' + self.website + '" target="_blank">' + self.website + '</a>';

    self.infoWindow.setContent(content);
    self.infoWindow.open(map, self.marker);
  };

  self.activate = function() {
    self.showWindow();
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    map.panTo(self.location);

    if (Place.prototype.active && Place.prototype.active !== self) {
      Place.prototype.active.deactivate();
    }

    Place.prototype.active = self;
  };

  self.deactivate = function() {
    self.marker.setAnimation(null);
    self.infoWindow.close();

    Place.prototype.active = null;
  };

  self.closeHandler = function() {
      self.deactivate();
  };

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

Place.prototype.active = null;

function AppViewModel() {
  var self = this;

  self.places = ko.observableArray([]);
  self.isLoading = ko.observable(true);
  self.search = ko.observable('');

  service = new google.maps.places.PlacesService(map);

  self.clickHandler = function(obj) {
    obj.activate();
  };

  self.searchResult = ko.computed(function() {
    self.places().forEach(function(place) {
      if(place.name.toLowerCase().indexOf(self.search()) >= 0) {
        place.setVisible(true);
      } else {
        place.setVisible(false);
      }
    });
  });

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



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: -22.9020102, lng: -43.2562987},
    disableDefaultUI: true,
  });

  ko.applyBindings(new AppViewModel());
}

var map;