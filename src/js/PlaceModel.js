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
    var url = 'https://api.foursquare.com/v2/venues/search';
        url += '?ll=' + self.lat + ',' + self.lng;
        url += '&query=' + self.name;
        url += '&client_id=IRY4XRFVZBIOBSJLKGYIOVJQLK3FN3VPPN0UMVRMVL2BA5RR';
        url += '&client_secret=X2ETPP3KI2QG3RYAEJBLCRGQ2P5NHHEF0QB40XX4BOBNUUVT';
        urk += '&v=20170321';

    fetch(url)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        if(data.response.venues.length == 0) {
          infoWindow.setContent(content);
          return;
        }
        var contactInfo = data.response.venues[0].contact;
        content += '<br>';

        if(typeof contactInfo.formmattedPhone != "undefined")
          content += '<br>Phone: ' + contactInfo.formattedPhone;

        if(typeof contactInfo.twitter != "undefined")
          content += '<br>Twitter: <a href="http://twitter.com/' + contactInfo.twitter + '" target="_blank">@' + contactInfo.twitter + '</a>';

        if(typeof contactInfo.facebookUsername != "undefined")
          content += '<br>Facebook: <a href="http://fb.com/' + contactInfo.facebookUsername + '" target="_blank">' + contactInfo.facebookUsername + '</a>';

        content += '<br>Foursquare: <a href="https://foursquare.com/venue/' + data.response.venues[0].id + '" target="_blank">' + data.response.venues[0].name + '</a>';

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