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
    realCity: "Los Angeles CA, 90045",
    lat: "33.9415889",
    lng: "-118.4107187"
}];

//Establish an observable for search bar data, which will be used to filter results later.
var Loc = function() {
	this.searchBar = ko.observable();
};

//Call the map once, with an assist from @abigail in the forums for the error message set up.
var map;
var infowindow;

function initMap() {
  	try {
  	
  		map = new google.maps.Map(document.getElementById('map'), {
    		center: {lat: 33.9290331, lng: -118.3740959},
    		zoom: 11,
    		scaleControl: true
    		
  		});
  		
  		} catch (error) {
  		
  		var errorMessage = 'Oops! Cannot connect to Google Maps at this time.'
  		console.log(errorMessage);
  		
  		}	
};


//Integrate Yelp API. Credit to @MarkN. Added from source https://github.com/bettiolo/oauth-signature-js to help with the oauth.
var createInfo = function (data, map) {
	var locationName = data.realName;
	var locationCity = data.realCity;
	
	function nonce_generate() {
		return (Math.floor(Math.random() * 1e12).toString());
	};
		
	var yelp_url = 'http://api.yelp.com/v2/search/';
	
	var yelp_key = 	"80vioFxwtHCQsZMHgSVGeA";
	var yelp_keySecret = "CU8LeQnDo4k2qx_kWLkrprBJykE";
	var yelp_token = "EynH5v43Zz-cLAUuu7k_nakZ2EnKmikF";
	var yelp_tokenSecret = "sgBfAJG8NMjQ8dutYW6D_OoN0ec";
		
		
	var parameters = {
		oauth_consumer_key: yelp_key,
		oauth_token: yelp_token,
		oauth_nonce: nonce_generate(),
		oauth_timestamp: Math.floor(Date.now()/1000),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		callback: 'cb',
		term: locationName,
		location: locationCity,
		limit: 1
	};
		
	var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, yelp_keySecret, yelp_tokenSecret);
    	
    parameters.oauth_signature = encodedSignature;	
    	
	var settings = {
  		url: yelp_url,
      	data: parameters,
		cache: true,
    	dataType: 'jsonp',
	    success: function(results) {
			var contentString = '<div>' +
                '<h1>' + results.businesses[0].name + '</h1>' +
                '<h3> Rating: <img src="' + results.businesses[0].rating_img_url + '"</h3>' +
            	'<h3> Phone: ' + results.businesses[0].phone + '</h3>' +
        		'<h3> Address: ' + results.businesses[0].location.display_address + '</h3>' +
                '</div>';
            infowindow.setContent(contentString);
            infowindow.open(map, data.marker);
    	    },
	        fail: function() {
			console.log('Yelp API Epic FAIL');
    	    }
	    };

// Send AJAX query via jQuery library.
    		$.ajax(settings);
};


var viewModel = function() {
	var that = this;
	infowindow = new google.maps.InfoWindow();
	var markers = [];
//Create markers for each location in the array. Assist from @kfmahre.
	this.initialMarkers = function () {
	
//Using a for loop to create a marker for each location.
		initialLocations.forEach(function(data){
		
			var marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(data.lat, data.lng),
				title: data.realName,
				animation: google.maps.Animation.DROP
			});
			markers.push(marker);
//Establish an event for when the marker is clicked, open the info window on the map, using the marker as location of where the info window will open.
			google.maps.event.addListener(marker, 'click', function() {
				map.panTo(marker.position);
				createInfo(data, map);
			});
		});
	};


	
initMap();
this.initialMarkers();   
};

//Call the new viewModel only when the DOM is ready for js to execute.
$(document).ready(function(){
ko.applyBindings(new viewModel());
});

