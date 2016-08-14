# neighborhood-map-fend

## About 
In this project I put together a simple maps application.
This application displays a list of 5 locations and a map. The user can select a location to display the pin and additional info (from Foursquare) for that location.  
The locations are stored as hardcoded addresses, but the Geocoding API from Google Maps is used to lookup those addresses and retrieve coordinates, which are used to locate the pins.  
Additionally, those coordinates are passed to the Foursquare API to retrieve some information about the restaurant that is located at there.  
Finally, there is a text box that is hooked to a basic text-matching filter that can be used to narrow the locations down.

## To run:
This webapp is hosted at https://rbtr.github.io/neighborhood-map-fend  
To browse locally, open the index.html.


## Attributions
This app uses the following 3rd party resources:
* Google Maps API
* Foursquare API
* KnockoutJS
* jQuery


## Design discussion
I set this up as an MVVM architecture for Knockout. Where possible, the view is bound to object of the viewmodel so that Knockout can handle displaying and updating those views with the underlying object.  
Since JS does not have "classes" as such, I separated my script files according to their purpose to help me stay organized. `app.js` is the main driver, `foursq.js` contains some helper methods and variables for interfacing with the Foursquare API, and `maps.js` contains the Google Maps API variables and helpers.  
My `model` consists of a model object with an array of `Location` objects. The VM holds a reference to the model and retrieves locations from it. All other application logic lives in or is referenced from the VM, including keeping track of the selected Location, input text filters, and what pins are visible.