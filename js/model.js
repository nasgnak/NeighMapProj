var initialLocations = [{
    realName: "Google",
    realAddress: "340 Main St",
    realCity: "Venice, CA 90291",
    lat: "33.991292",
    lng: "-118.4868472"
}, {
    realName: "Blue Star Donuts",
    realAddress: "1142 Abbot Kinney Blvd.",
    realCity: "Los Angeles, CA 90291",
    lat: "33.9912933",
    lng: "-118.4715263"
}, {
    realName: "Ramen Yamadaya",
    realAddress: "3118 W. 182nd St.",
    realCity: "Torrance, CA 90504",
    lat: "33.8653053",
    lng: "-118.329391"
}, {
    realName: "Del Amo Fashion Center",
    realAddress: "3525 W. Carson St.",
    realCity: "Torrance, CA 90503",
    lat: "33.8332536",
    lng: "-118.3511273"
}, {
    realName: "Los Angeles International Airport",
    realAddress: "1 World Way",
    realCity: "Los Angeles, CA 90045",
    lat: "33.9415889",
    lng: "-118.4107187"
}];


var map, infowindow, marker;

//This is in reference to the onerror call in the Google Maps API script. Thanks to whomever graded my code for the tip!
function googleError() {
    alert("Google Maps has failed to load at this time.");
};

//I moved the ko.applyBindings here to ensure that my viewModel will be called only after my map has been instantiated. 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 33.9290331,
            lng: -118.3740959
        },
        zoom: 11,
        scaleControl: true
    });

    ko.applyBindings(new viewModel());
}



//Integrate Yelp API. Credit to @MarkN. Added from source https://github.com/bettiolo/oauth-signature-js to help with the oauth.
var createInfo = function(data, map) {
    var locationName = data.realName;
    var locationCity = data.realCity;

    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelp_url = 'http://api.yelp.com/v2/search/';

    var yelp_key = "80vioFxwtHCQsZMHgSVGeA";
    var yelp_keySecret = "CU8LeQnDo4k2qx_kWLkrprBJykE";
    var yelp_token = "EynH5v43Zz-cLAUuu7k_nakZ2EnKmikF";
    var yelp_tokenSecret = "sgBfAJG8NMjQ8dutYW6D_OoN0ec";


    var parameters = {
        oauth_consumer_key: yelp_key,
        oauth_token: yelp_token,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        term: locationName,
        location: locationCity,
        limit: 1
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, yelp_keySecret, yelp_tokenSecret);

    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        success: function(results) {
            var contentString = '<div>' +
                '<p align="center">' + results.businesses[0].name + '</p>' +
                '<p> Rating: <img src="' + results.businesses[0].rating_img_url + '"</p>' +
                '<p> Phone: ' + results.businesses[0].phone + '</p>' +
                '<p> Address: ' + results.businesses[0].location.display_address + '</p>' +
                '</div>';
            infowindow.setContent(contentString);
            infowindow.open(map, data.marker);
            clearTimeout(yelpTimeout);
        },
    };

    //Create an error message should the Yelp API fail to succeed.
    var yelpTimeout = setTimeout(function() {
        $contentString.text("Failed to get Yelp API response!");
    }, 8000);

    // Send AJAX query via jQuery library.
    $.ajax(settings);
};

var viewModel = function() {
    var that = this;
    infowindow = new google.maps.InfoWindow();
    that.searchInfo = ko.observableArray();
    that.search = ko.observable("");

    //Create markers for each location in the array. Assist from @kfmahre.
    this.markers = function() {

        //Create a toggleBounce function to add animation when a marker is clicked.
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout("marker.setAnimation(null)", 1500);
            }
        }
		
		var bounceMarker = function(marker){
			return function (){
				toggleBounce(marker);
			}
		}
		
        initialLocations.forEach(function(data) {
            that.searchInfo().push(data)
        });

        for (var i = 0; i < that.searchInfo().length; i++) {

            var currentMarker = that.searchInfo()[i];

            marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(that.searchInfo()[i].lat, that.searchInfo()[i].lng),
                title: that.searchInfo().realName,
                animation: google.maps.Animation.DROP
            });

			google.maps.event.addListener( marker, 'click', bounceMarker(marker));
            //Establish an event for when the marker is clicked, the marker and var i will be set as parameters,
            //and execute the panTo, toggleBounce, and createInfo function.
            marker.addListener('click', function(marker, i) {
                return function(){ 
                	map.panTo(marker.position);
                	//bounceMarker(marker);
                	createInfo(that.searchInfo()[i], map);
                }

            }(marker, i));
            that.searchInfo()[i].marker = marker;
        };


        //insert filtering code here


    };
    this.markers();
};
