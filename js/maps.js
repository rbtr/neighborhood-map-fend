// Maps helpers

/*
    This file contains some code derived from the maps manipulation code in class UD864,
    modified to be more generic and to suit my project
 */

var map;

var defaultIcon;
var highlightedIcon;
var infoWindow;

var mapsApiKey = "AIzaSyCeaNKnQqiKX9LRx0yLGbB-DT7d9F-1o3s";

var hasLocatedMap = false;

var startLatLng = {
    lat: 39.744053,
    lng: -75.5492022
};

// I view this as part of the view, as it is drawing itself.
// Therefore it needs to go through the ViewModel to get Model data
function initMap() {
    // Construct new map
    map = new google.maps.Map( document.getElementById( 'map' ), {
        center: startLatLng,
        zoom: 15
    } );
    viewmodel.locations().forEach( function ( location ) {
        locateAndCreateMarker( location );
    } );


    // Style the markers a bit. This will be our listing marker icon.
    defaultIcon = makeMarkerIcon( '0091ff' );

    // Create a "highlighted location" marker color for when the user mouses over the marker.
    highlightedIcon = makeMarkerIcon( 'FFFF24' );

    infoWindow = new google.maps.InfoWindow();
}

// Geocode the addresses in the locations data, using the addresses to get latlng, info, and descriptions
var geocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";

// Geocoder that takes a Location with an address and fills in other data on the Location
function locateAndCreateMarker( location ) {
    var addr = location.address.replace( " ", "+" );
    $.getJSON(
        geocodeBaseUrl + "address=" + addr + "&key=" + mapsApiKey
    ).then( function ( response ) {
        location.mapsResponse = response;
        if ( response.status === "OK" && response.results.length > 0 ) {
            location.latlng = response.results[ 0 ].geometry.location;
            location.marker = makeMarker( location );
            location.marker.addListener( "click", function () {
                var loc = location;
                viewmodel.onLocationSelected( loc );
            } );
            location.marker.addListener( 'mouseover', function () {
                this.setIcon( highlightedIcon );
            } );
            location.marker.addListener( 'mouseout', function () {
                this.setIcon( defaultIcon );
            } );
        }
        fourSqLookup( location );
    } );
}


/*
 Wrapper to abstract making Marker objects
 position: {lat, lng}
 title: string title
 */
function makeMarker( location ) {
    return new google.maps.Marker( {
        position: location.latlng,
        title: location.address,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon
        //id: i
    } );
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon( markerColor ) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size( 21, 34 ),
        new google.maps.Point( 0, 0 ),
        new google.maps.Point( 10, 34 ),
        new google.maps.Size( 21, 34 ) );
    return markerImage;
}

// This function will loop through a markers array and display them all.
function showMarkers( markers ) {
    if ( !hasLocatedMap ) {
        map.center = markers[ 0 ].position;
        hasLocatedMap = true;
    }
    bounds = map.getBounds();
    if ( bounds ) {
        bounds = new google.maps.LatLngBounds();
    }
    // Extend the boundaries of the map for each marker and display the marker
    for ( var i = 0; i < markers.length; i++ ) {
        markers[ i ].setMap( map );
        bounds.extend( markers[ i ].position );
    }
    map.fitBounds( bounds );
}

var bounds;

function showMarker( marker ) {
    if ( !hasLocatedMap ) {
        map.center = marker.position;
        hasLocatedMap = true;
    }
    bounds = map.getBounds();
    if ( bounds ) {
        bounds = new google.maps.LatLngBounds();
    }
    // Extend the boundaries of the map and display the marker
    marker.setMap( map );
    bounds.extend( marker.position );
    map.fitBounds( bounds );
}

function showInfo( location ) {
    // Check to make sure the infowindow is not already opened on this marker.
    if ( infoWindow.marker != location.marker ) {
        infoWindow.setContent( "" );
        infoWindow.marker = location.marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infoWindow.addListener( "closeclick", function () {
            infoWindow.marker = null;
        } );
        if ( location.fourSqInfo ) {
            infoWindow.setContent( getInfo( location ) );
        } else {
            infoWindow.setContent( "<div>" + location.name() + "</div>" +
                "<div>No Info Found!</div>" );
        }
    }
    // Open the infowindow on the correct marker.
    infoWindow.open( map, location.marker );
}

