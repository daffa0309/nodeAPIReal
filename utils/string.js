/**
 * Convert camelCase to underscore_case
 * @param {string} str - string to be converted
 * @return {string} - converted string
 */
function convertCamelCaseToUnderscoreCase(str, upperCase = true) {
    if (upperCase) {
        return str.replace(/([A-Z])/g, '_$1').toUpperCase();
    } else {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
}

function stringTemplate(strings, ...keys) {

    return function(...values) {
        const dict = values[values.length - 1] || {};
        let result = [strings[0]];

        keys.forEach((key, i) => {
            const value = dict[key];
            result.push(value, strings[i + 1]);
        });

        return result.join('');
    };
}

/**
 * Convert phoneNumber with Country Code
 * @param {string} str - string to be converted
 * @return {string} - converted string
 */
function convertPhoneNumberWithCountryCode(str) {
    if(str) {
        str = str.replace(/[^\d+]+/g, '');
        str = str.replace(/^0/, '+62');
        if (str.match(/^62/)) str = '+' + str;
        if (!str.match(/^\+/)) str = '+62' + str;
    }

    return str;
}

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
  
module.exports = {
    convertCamelCaseToUnderscoreCase,
    convertPhoneNumberWithCountryCode,
    stringTemplate,
    isJSON,
    replaceAll,
};
