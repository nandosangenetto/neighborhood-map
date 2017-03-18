function Restaurant(obj) {
  var self = this;
  self.id = obj.id;
  self.location = obj.geometry.location;
  self.visible = true;
  self.name;
  self.address;
  self.website;

  self.infoWindow = new google.maps.InfoWindow();

  self.marker = new google.maps.Marker({
    map: map,
    position: self.location
  });

  self.getDetails = function(callback) {
    service.getDetails(obj, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      self.name = result.name
      self.address = result.formatted_address;
      self.website = result.website;
      typeof callback === 'function' && callback();
    });
  };

  self.showWindow = function() {
    self.getDetails(function() {
      var content = '<strong>' + self.name + '</strong><br>';
          content += self.address;
          if(typeof self.website !== 'undefined')
            content += '<br><br><a href="' + self.website + '" target="_blank">' + self.website + '</a>';

      self.infoWindow.setContent(content);
      self.infoWindow.open(map, self.marker);
    });
  };

  self.activate = function() {
    self.showWindow();
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    map.panTo(self.location);

    if (Restaurant.prototype.active && Restaurant.prototype.active !== self) {
      Restaurant.prototype.active.deactivate();
    }

    Restaurant.prototype.active = self;
  }

  self.deactivate = function() {
    self.marker.setAnimation(null);
    self.infoWindow.close();

    Restaurant.prototype.active = null;
  };

  self.closeHandler = function() {
      self.deactivate();
  };

  self.openHandler = function() {

    if(Restaurant.prototype.active === self) {
      self.deactivate();
    } else {
      self.activate();
    }

  };

  self.marker.addListener('click', self.openHandler);
  self.infoWindow.addListener('closeclick', self.closeHandler);

}

Restaurant.prototype.active = null;

function AppViewModel() {
  var self = this;

  self.restaurants = ko.observableArray([]);
  self.isLoading = ko.observable(true);
  self.search = ko.observable('');

  service = new google.maps.places.PlacesService(map);

  map.addListener('idle', performSearch);

  self.searchResult = ko.computed(function() {
    // console.log(self.search(), self.restaurants());
  });

  // get data from Google Maps Radar API
  function performSearch() {
    service.radarSearch({
      bounds: map.getBounds(),
      keyword: 'veggie',
      type: 'restaurant'
    }, placeHandler);
  }

  function placeHandler(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }
    for (var i = 0, result; result = results[i]; i++) {
      addRestaurant(result);
    }
    self.isLoading(false);
  }

  function addRestaurant(obj)
  {
    var matches;
    for(var i = 0, l = self.restaurants().length; i < l; i++) {
      matches = self.restaurants()[i].id === obj.id;
      if(matches === true)
        break;      
    }

    if(!matches) {
      self.restaurants.push(new Restaurant(obj));
    }
  }

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