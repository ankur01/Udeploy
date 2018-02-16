/*global translations, urls
 */

//enable accessibility keypress check
function a11yClick(event) {
    if (event.type === 'click') {
        return true;
    }
    if (event.type === 'keypress') {
        var code = event.charCode || event.keyCode;
        if ((code === 32) || (code === 13)) {
            return true;
        }
    }
    return false;
}

function launch(event, target) {
    var url;
    if (a11yClick(event)) {
        if (urls) {
            url = urls[target];
            window.open(url, '_blank');
        }
    }
}

function detectLocale() {
    var browserLanguagePropertyKeys = ['languages', 'language', 'browserLanguage', 'userLanguage', 'systemLanguage'];
    var i;
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        var prop = browserLanguagePropertyKeys[i];
        var val = window.navigator[prop];
        if (val) {
            if (typeof val === 'object') {
                return val[0];
            }
            return val;
        }
    }
}

function translate(translatedDic) {
    var els = document.querySelectorAll('.i18n');
    var i;
    for (i = 0; i < els.length; i++) {
        var el = els[i];
        var engContent = el.textContent;
        if (translatedDic.hasOwnProperty(engContent)) {
            el.textContent = translatedDic[engContent];
        }
    }
}

window.onload = function() {
    var userLocale = detectLocale();
    if (userLocale) {
        if (translations.hasOwnProperty(userLocale)) {
            translate(translations[userLocale]);
        }
        else {
            userLocale = userLocale.split('-')[0];
            if (translations.hasOwnProperty(userLocale)) {
                translate(translations[userLocale]);
            }
        }
    }
};
