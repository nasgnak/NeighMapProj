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

var Loc = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
};

var viewModel = function() {
    var that = this;
    this.locations = ko.observableArray([]);
    initialLocations.forEach(function(realPlace) {
        that.locations.push(realPlace);
    });

    this.currentLoc = ko.observable(this.locations()[0]);
    this.selectLoc = function(selectedLoc) {
        self.currentLoc(selectedLoc);
    };
    //Google Maps API base layer, attempting to only call it once
    var map;
    var marker;

    function initMap() {
        var mapOptions = {
            disableDefaultUI: true
        };
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        initialLocations.forEach(function(loc) {
            marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(loc.lat, loc.lng),
                title: loc.name,
                clickable: true
            });
        });
		//function to create the markers on the map
        function createMapMarker(placeData) {
            var lat = placeData.geometry.location.lat();
            var lon = placeData.geometry.location.lng();
            var name = placeData.formatted_address;
            var bounds = window.mapBounds;

            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name
            });

            var infoWindow = new google.maps.InfoWindow({
                content: name
            });

            google.maps.event.addListener(marker, 'click', function() {
                
                infoWindow.open(map, marker);
            });

            bounds.extend(new google.maps.LatLng(lat, lon));
            map.fitBounds(bounds);
            map.setCenter(bounds.getCenter());
        }

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                createMapMarker(results[0]);
            }
        }

        function pinPoster(locations) {
            var service = new google.maps.places.PlacesService(map);
            locations.forEach(function(place) {
                var request = {
                    query: place.realAddress
                };
                service.textSearch(request, callback);
            });
        }
        window.mapBounds = new google.maps.LatLngBounds();
        var locations = that.locations();
        pinPoster(locations);
        
        this.searchBarInfo = ko.observable('');
        this.filterLocations = ko.computed(function() {
            if (this.searchBarInfo() === "") {
                for (var i = 0; i< that.locations().length; i++){
                    if (that.locations()[i].marker !== undefined) {
                        that.locations()[i].marker.setVisible(true);
                    }
                }
            	return that.locations();
            } else {
                var filter = this.searchBarInfo().toLowerCase();
                return ko.utils.arrayFilter(that.locations(), function (loc){
                var visible = loc.realName.toLowerCase().indexOf(filter) !== -1;
                loc.marker.setVisible(visible);
                return visible;
                });
            }
        });
            
        };
        initMap();
    };



ko.applyBindings(new viewModel());