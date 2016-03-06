var initialLocations = [{
    realName: "Google",
    realAddress: "340 Main St. Venice, CA 90291"
}, {
    realName: "Blue Star Donuts",
    realAddress: "1142 Abbot Kinney Blvd. Los Angeles, CA 90291"
}, {
    realName: "Ramen Yamadaya",
    realAddress: "3118 W. 182nd St. Torrance, CA 90504"
}, {
    realName: "Del Amo Fashion Center",
    realAddress: "3525 W. Carson St. Torrance, CA 90503"
}, {
    realName: "Los Angeles International Airport",
    realAddress: "1 World Way Los Angeles CA, 90045"
}];

//Establish an array to store marker data, and an observable for the search bar, which will be used to filter results later.
var Loc = function() {
	this.places = ko.observableArray();
	this.searchBar = ko.observable();
};

//Call the map once, with an assist from @abigail in the forums for the error message set up.
var geocoder;
var map;

function initMap() {
  	geocoder = new google.maps.Geocoder();
  	try {
  		map = new google.maps.Map(document.getElementById('map'), {
    		center: {lat: 33.8336192, lng: -118.421149},
    		zoom: 10,
    		scaleControl: true
  		});
  		
  		} catch (error) {
  		var errorMessage = 'Oops! Cannot connect to Google Maps at this time.'
  		map.append(errorMessage);
  		}
  		
}

//Create a function that gets the latitude and longitude of a location
var address;
function getAddress (data) {
	address = initialLocations.realAddress;
	geocoder.geocode({'address':address}, function (results, status) {
	if (status == google.maps.Geocoderstatus.OK) {
		Loc.places.push(results[0].geometry.location);
		} else {
		alert ("Geocode was unsuccessful");
		}
	});
	return Loc.places;
}

//Get the latitude and longitude for each location in initialLocations
initialLocations.forEach(getAddress());



var viewModel = function() {
	//var that = this;

	
   
}    

ko.applyBindings(new viewModel());