document.addEventListener("DOMContentLoaded", () => {
  const cookieConsentPopup = document.getElementById("cookieConsentPopup");
  const acceptCookiesBtn = document.getElementById("acceptCookies");
  const rejectCookiesBtn = document.getElementById("rejectCookies");
  const customizeCookiesBtn = document.getElementById("customizeCookies");
  const cookieCustomizeSection = document.getElementById("cookieCustomize");
  const savePreferencesBtn = document.getElementById("savePreferences");
  const analyticsCookiesCheckbox = document.getElementById("analyticsCookies");

  const COOKIE_NAME = "cdss_cookie_consent";
  const COOKIE_EXPIRY_DAYS = 365; // Consent lasts for 1 year

  // Helper function to set a cookie
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  // Helper function to get a cookie
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  // Helper function to erase a cookie
  function eraseCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  // Function to load Google Analytics conditionally
  function loadGoogleAnalytics(consent) {
    if (consent === "true") {
      // Replace 'YOUR_GA_TRACKING_ID' with your actual Google Analytics 4 Measurement ID (e.g., 'G-XXXXXXXXXX')
      const gaTrackingId = 'G-Y4YELEJN5E';

      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaTrackingId);
        console.log("Google Analytics loaded and configured.");
      };
    } else {
      console.log("Google Analytics not loaded due to consent preferences.");
      // If GA was already loaded and then consent revoked, you might need to
      // disable tracking or send opt-out signals, depending on your GA setup.
      // For a fresh load, simply not loading the script is sufficient.
    }
  }

  // Function to save preferences and hide popup
  function saveAndHidePopup(analyticsConsent) {
    const consentValue = JSON.stringify({
      necessary: true, // Always true
      analytics: analyticsConsent,
      // Add other categories here
    });
    setCookie(COOKIE_NAME, consentValue, COOKIE_EXPIRY_DAYS);
    cookieConsentPopup.classList.remove("cookie-consent-visible");
    cookieConsentPopup.classList.add("cookie-consent-hidden");
    loadGoogleAnalytics(analyticsConsent ? "true" : "false"); // Load GA based on new preference
  }

  // Event Listeners
  acceptCookiesBtn.addEventListener("click", () => {
    saveAndHidePopup(true); // Accept all, so analytics is true
  });

  rejectCookiesBtn.addEventListener("click", () => {
    saveAndHidePopup(false); // Reject all, so analytics is false
    // You might also want to erase analytics cookies if they were previously set
    // eraseCookie('_ga'); // Example for old Universal Analytics
    // eraseCookie('_gid');
    // For GA4, consent mode handles it more granularly
  });

  customizeCookiesBtn.addEventListener("click", () => {
    cookieCustomizeSection.classList.toggle("cookie-customize-hidden");
  });

  savePreferencesBtn.addEventListener("click", () => {
    const analyticsConsent = analyticsCookiesCheckbox.checked;
    saveAndHidePopup(analyticsConsent);
  });

  // Check existing consent on page load
  const existingConsent = getCookie(COOKIE_NAME);
  if (existingConsent) {
    try {
      const consentPrefs = JSON.parse(existingConsent);
      loadGoogleAnalytics(consentPrefs.analytics ? "true" : "false");
      cookieConsentPopup.classList.add("cookie-consent-hidden"); // Hide if consent already exists
    } catch (e) {
      console.error("Error parsing cookie consent:", e);
      // If cookie is malformed, treat as no consent
      cookieConsentPopup.classList.remove("cookie-consent-hidden");
      cookieConsentPopup.classList.add("cookie-consent-visible");
    }
  } else {
    // No consent found, show the popup
    cookieConsentPopup.classList.remove("cookie-consent-hidden");
    cookieConsentPopup.classList.add("cookie-consent-visible");
  }
});