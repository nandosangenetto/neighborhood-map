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

    loading = '<br><br>Loading contact informations...';
    
    self.getInfoFromFoursquare(content);

    infoWindow.setContent(content+loading);
    infoWindow.open(map, self.marker);
  };

  /* 
    getInfoFromFoursquare get contact info from Foursquare if it exists
  */
  self.getInfoFromFoursquare = function(content) {
    var url = 'https://api.foursquare.com/v2/venues/search?ll=' + self.lat + ',' + self.lng + '&query=' + self.name + '&client_id=IRY4XRFVZBIOBSJLKGYIOVJQLK3FN3VPPN0UMVRMVL2BA5RR&client_secret=X2ETPP3KI2QG3RYAEJBLCRGQ2P5NHHEF0QB40XX4BOBNUUVT&v=20170321';

    fetch(url)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        var contactInfo = data.response.venues[0].contact;
        content += '<br>';
        content += (typeof contactInfo.formmattedPhone != "undefined") ? '<br>Phone: ' + contactInfo.formattedPhone : '';
        content += (typeof contactInfo.twitter != "undefined") ? '<br>Twitter: @' + contactInfo.twitter : '';
        content += (typeof contactInfo.facebookUsername != "undefined") ? '<br>Facebook: @' + contactInfo.facebookUsername : '';
        infoWindow.setContent(content);
      }).catch(function (error) {
          app.message('An error occurred when loading info from Foursquare');
          setTimeout(function() {
            app.message('');
          }, 3000);
          infoWindow.setContent(content);
      });
  };

  /*
    activate method to open InfoWindow, add animation and deactivate
    all others markers
  */
  self.activate = function() {
    self.showWindow();
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    map.panTo(self.location);

    if (Place.prototype.active && Place.prototype.active !== self)
      Place.prototype.active.deactivate();

    Place.prototype.active = self;
  };

  /*
    deactivate method to close InfoWindow and remove animation
  */
  self.deactivate = function() {
    self.marker.setAnimation(null);
    Place.prototype.active = null;
  };

  /*
    openHandler method with behaviours when Place is selected
  */
  self.openHandler = function() {
    if(Place.prototype.active !== self)
      self.activate();
  };

  self.marker.addListener('click', self.openHandler);

}

// Setting an static property to allow only one Place active at time
Place.prototype.active = null;