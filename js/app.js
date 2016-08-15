// These are the addresses for the locations to display on the map eventually
var defaultAddresses = [
    "500 N Market St, Wilmington, DE",
    "239 N Market St, Wilmington, DE",
    "821 N Market St, Wilmington, DE",
    "902 N Market St, Wilmington, DE",
    "824 N Market St, Wilmington, DE"
];

// Location object. Initially contains just an address, but is populated with more properties later.
// The name property is an observable because it is bound in the view and will potentially change.
function Location(address) {
    this.address = address;
    this.name = ko.observable(address);
}


// Helper method to make a Locations array out of the defaultAddresses
// This lets me update the simpler defaultAddresses array instead of a hardcoded Locations array.
function initLocations() {
    var locArr = [];
    defaultAddresses.forEach(function (addr) {
        locArr.push(new Location(addr));
    });
    return locArr;
}


// The Model. Contains only the defaultLocations array.
var Model = function () {
    this.defaultLocations = initLocations();
};

// The ViewModel. Contains a ref to the model, and the wiring for the application.
function ViewModel() {
    var self = this;

    // Create a new model at runtime.
    this.model = new Model();

    // The filter should start empty.
    this.filter = ko.observable("");

    // The locations array that is displayed changes depending on the filter, so it is a ko.computed
    this.locations = ko.pureComputed(function () {
        var filterRef = this.filter();
        var filteredLocations = [];
        if (filterRef == "") {
            // No filter, so we can directly return the defaultLocations
            if (self.arePinsVisible()) {
                // Before we return it, turn the pins back on if they should be displayed
                this.model.defaultLocations.forEach(function (location) {
                    if (location.marker) {
                        location.marker.setMap(map);
                    }
                });
            }
            return this.model.defaultLocations;
        } else {
            // Simple char matching string filter. Inefficient, but it works.
            this.model.defaultLocations.forEach(function (location) {
                if (location.name().toLowerCase().indexOf(filterRef.toLowerCase()) >= 0) {
                    // The location passes the filter, so show the pin and add it to the array to be return.
                    if (self.arePinsVisible() && location.marker) {
                        location.marker.setMap(map);
                    }
                    filteredLocations.push(location);
                } else {
                    // Doesn't pass the filter, hide the pin if it is shown.
                    if (location.marker && location.marker.map) {
                        location.marker.setMap(null);
                    }
                }
            })
        }
        return filteredLocations;
    }, this);

    // No selected location initially, but this will store the user selection.
    this.selectedLocation = false;

    // Function that handles hiding/showing the infowindow and pin when the user makes a selection.
    this.onLocationSelected = function (location) {
        if (!self.arePinsVisible()) {
            showMarker(location.marker);
        }
        self.selectedLocation = location;
        showInfo(self.selectedLocation);
        console.log(self.selectedLocation);
    };

    // Pins can all be shown/hidden, so keep track of that state.
    this.arePinsVisible = ko.observable(false);
    this.togglePinsHint = ko.computed(function () {
        if (self.arePinsVisible()) {
            return 'Hide All Pins';
        } else {
            return 'Show All Pins';
        }
    }, self);

    // Hide or show all the pins
    this.togglePins = function () {
        var markers = [];
        self.locations().forEach(function (location) {
            if (location.marker) {
                markers.push(location.marker);
            }
        });

        if (self.arePinsVisible()) {
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
        } else {
            showMarkers(markers);
        }

        self.arePinsVisible(!self.arePinsVisible());
    };
}


// Finally, let's get everything started
// Bind the viewmodel for Knockout
var viewmodel = new ViewModel();
ko.applyBindings(viewmodel);
