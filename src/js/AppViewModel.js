/*
  AppViewModel
*/
function AppViewModel() {
  var self = this;

  // Defining properties
  self.places = ko.observableArray([]);
  self.search = ko.observable('');
  self.message = ko.observable('Loading map');
  self.isMapLoaded = ko.observable(false);

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
    // self.places().forEach(function(place) {
    //   if(place.name.toLowerCase().indexOf(self.search().toLowerCase() ) >= 0) {
    //     place.setVisible(true);
    //   } else {
    //     place.setVisible(false);
    //   }
    // });
  });

  self.getPlacesData = function() {
    self.message('Loading places');
    // fetch request to get the JSON data with all places
    fetch('data/data.json').then(function(response) {
      return response.json();
    }).then(function(data) {
      data.forEach(function(data) {
        self.places.push(new Place(data));
      });
      self.message('');
    }).catch(function(err) {
      self.message('A problem occurred when loading the places');
    }); 
  };

  /*
    if map is loaded, we'll get all the places data from 
    JSON and instantiate a new Place
  */
  self.isMapLoaded.subscribe(function(newValue) {
    if(newValue) {
      self.getPlacesData();
    }
  });



}