function init(faviconUrl, pageTitle, controlPopulation, timeout) {
  var originalFavicon = document.querySelector("link[rel='icon']").href;
  var originalTitle = document.title;
  var hasReturned = false;
  var eventSent = false;
  var tabGrabbedEventSent = false;
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden" && !hasReturned) {
      if (!eventSent) {
        var randomNumber = Math.random() * 100;
        var variant = randomNumber > controlPopulation ? "variant" : "control";
        dataLayer.push({
          event: "TabGrab Initiated",
          variant: variant
        });
        eventSent = true;
      }
      if (variant === "variant") {
        var interval = setInterval(function() {
          var link = document.querySelector("link[rel='icon']");
          link.href = link.href === originalFavicon ? faviconUrl : originalFavicon;
          document.title = document.title === originalTitle ? pageTitle : originalTitle;
        }, timeout);
        setTimeout(function() {
          document.querySelector("link[rel='icon']").href = originalFavicon;
          document.title = originalTitle;
        }, timeout * 2);
      }
      window.addEventListener("focus", function() {
        clearInterval(interval);
        hasReturned = true;
        if (!tabGrabbedEventSent) {
          dataLayer.push({
            event: "Tab Grabbed",
            variant: variant
          });
          tabGrabbedEventSent = true;
        }
      });
    }
  });
}

module.exports = {
  TabGrab: {
    init: init
  }
};