// Foursquare helpers

var baseVenueUrl = "https://api.foursquare.com/v2/venues/search?";

var apiKeyLatLng = "ll=";
var apiKeyClientId = "client_id=";
var apiKeyClientSecret = "client_secret=";
var apiKeyVersion = "v=";

var apiValClientId = "M00YZYSUQEQTOOH0CHAOEIIV12IL5H0A1Q0PLYTMBFQ4O55X";
var apiValClientSecret = "VJ0TLTHFR52E0ZXY45WTS5YBCCPQKEKW1HVXRAHFS0UDNJ3F";
var apiValVersion = "20160814";


// Add foursquare info to the passed location object.
function fourSqLookup( location ) {
    var latlng = location.latlng;
    var ll = latlng.lat + "," + latlng.lng;
    $.getJSON(
        baseVenueUrl + apiKeyLatLng + ll + "&" + apiKeyClientId + apiValClientId + "&" + apiKeyClientSecret + apiValClientSecret + "&" + apiKeyVersion + apiValVersion
    ).then( function ( result ) {
        location.fourSqResult = result;
        if ( "200" == result.meta.code && 0 < result.response.venues.length ) {
            location.fourSqInfo = result.response.venues[ 0 ];
            location.fourSqLatLng = {
                "lat": location.fourSqInfo.location.lat,
                "lng": location.fourSqInfo.location.lng
            };
            location.name( location.fourSqInfo.name );
        }
    } );
}

// Make the HTML snippet for the infoWindow
function getInfo( location ) {
    var homePage;
    var hereNow;
    var htmlStr;
    var menuLink;
    var title = location.name();
    var type = location.fourSqInfo.categories[ 0 ].shortName;

    if (location.fourSqInfo.menu) {
        menuLink = location.fourSqInfo.menu.url;
    }

    hereNow = location.fourSqInfo.hereNow.summary;
    homePage = location.fourSqInfo.url;

    htmlStr = "";

    if (title) {
        htmlStr = htmlStr.concat("<h3>" + title + "</h3>");
    }
    if (type) {
        htmlStr = htmlStr.concat("<p>"+ type + "</p>");
    }
    if (homePage) {
        htmlStr = htmlStr.concat("<a href='" + homePage + "'>Website</a>");
    }
    if (homePage && menuLink) {
        htmlStr = htmlStr.concat(" and ");
    }
    if (menuLink) {
        htmlStr = htmlStr.concat("<a href='"+ menuLink + "'>Menu</a>");
    }
    if (hereNow) {
        htmlStr = htmlStr.concat("<p>"+ hereNow + "</p>");
    }
    htmlStr.concat("<p> Info provided by Foursquare </p>");
    return htmlStr;
}