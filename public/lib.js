// tabgrab.js

// Add this line to specify that the file is a module
export {};

// Define the init function
function init(faviconUrl, pageTitle, controlPopulation, timeout) {
  // Stores the original favicon URL and page title
  var originalFavicon = document.querySelector("link[rel='icon']").href;
  var originalTitle = document.title;

  // Flag to keep track of whether the visitor has returned to the tab
  var hasReturned = false;

  // Flag to keep track of whether the dataLayer event has been sent
  var eventSent = false;

  // Adds a new flag to keep track of whether the "Tab Grabbed" event has been sent
  var tabGrabbedEventSent = false;

  // Listens for the visibilitychange event
  document.addEventListener("visibilitychange", function() {
    // If the tab has become inactive and the visitor hasn't returned yet
    if (document.visibilityState === "hidden" && !hasReturned) {
      // Check if the dataLayer event has already been sent
      if (!eventSent) {
        // Check if the user is part of the control population
        var randomNumber = Math.random() * 100;
        var variant = randomNumber > controlPopulation ? "variant" : "control";
        dataLayer.push({
          event: "TabGrab Initiated",
          variant: variant
        });
        eventSent = true;
      }

      // Switches back and forth between the original and new favicon and page title
      // Only for visitors in the variant group
      if (variant === "variant") {
        var interval = setInterval(function() {
          var link = document.querySelector("link[rel='icon']");
          link.href = link.href === originalFavicon ? faviconUrl : originalFavicon;
          document.title = document.title === originalTitle ? pageTitle : originalTitle;
        }, timeout);

        // Reverts to the original favicon and page title after the first loop
        setTimeout(function() {
          document.querySelector("link[rel='icon']").href = originalFavicon;
          document.title = originalTitle;
        }, timeout * 2);
      }

      // Listens for the focus event to check if the visitor has returned to the tab
      window.addEventListener("focus", function() {
        // Stops switching the favicon and page title
        clearInterval(interval);

        // Sets the flag to indicate that the visitor has returned
        hasReturned = true;

        // Check if the "Tab Grabbed" event has already been sent
        if (!tabGrabbedEventSent) {
          // Sends a dataLayer event "Tab Grabbed"
          dataLayer.push({
            event: "Tab Grabbed",
            variant: variant
          });

          // Sets the flag to indicate that the event has been sent
          tabGrabbedEventSent = true;
        }
      });
    }
  });
}

// Export the init function as part of the TabGrab object
export const TabGrab = {
  init: init
};