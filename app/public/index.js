let cookieConsent = getCookie("cookie_consent");
let cookieContainer = document.getElementById("cookieConsentContainer");
let acceptCookieButton = document.getElementById("acceptCookieButton");
let declineCookieButton = document.getElementById("declineCookieButton");

function initCookies() {
    acceptCookieButton.addEventListener("click", acceptCookie);
    declineCookieButton.addEventListener("click", declineCookie);
    if (cookieConsent === "") {
        cookieContainer.style.display = "block";
    }
    else {
        cookieContainer.style.display = "none";
    }
}

function acceptCookie() {
    cookieContainer.style.display = "none";
    deleteCookie("cookie_consent");
    setCookie("cookie_consent", true, 30);
}

function declineCookie() {
    cookieContainer.style.display = "none";
}

// The following two methods, getCookie(...) and setCookie(...) are inspired by 
// https://www.codexworld.com/cookie-consent-popup-with-javascript/
function getCookie(name) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArr = decodedCookie.split(';');
    for (let c of cookieArr) {
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(name, value, expirationDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    let expiration = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expiration + ";path=/";
}

function deleteCookie(name) {
    document.cookie = name + "=; max-age=-1;";
}

initCookies();