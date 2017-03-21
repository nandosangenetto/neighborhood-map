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