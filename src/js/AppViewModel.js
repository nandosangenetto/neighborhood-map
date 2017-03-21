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
  getPlaces.open('GET', 'data/data.json');
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