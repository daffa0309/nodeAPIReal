const _ = require('lodash');

const {convertCamelCaseToUnderscoreCase} = require('./string');

/**
 * Prepare object to be return as an API response
 * @param {Object} data - object whose attributes will be removed
 * @param  {string[]} attrs - attributes that will be removed
 * @return {Object} - object whose attribtutes has been removed
 */
function prepareObjectAsAPIResponse(data, ...attrs) {
    // Remove unwanted attributes
    data = removeObjectAttributes(data, ...attrs);
    // Transform object attribute keys to camelCase
    data = _.transform(
        data,
        (res, val, key) => res[_.camelCase(key)] = val
    );
    return data;
}

/**
 * @param {Object} data - object whose attributes will be removed
 * @param  {string[]} attrs - attributes that will be removed
 * @return {Object} - object whose attribtutes has been removed
 */
function removeObjectAttributes(data, ...attrs) {
    attrs.forEach((attr) => delete data[attr]);
    return data;
}

/**
 * Transform all attribute keys in an object to pascal case
 * @param {Object} data
 * @return {Object}
 */
function transformAttributesToPascalCase(data, upperCase = true) { 
    return _.transform(
        data,
        (res, val, key) => res[convertCamelCaseToUnderscoreCase(key, upperCase)] = val
    );
}

function clean(obj) {
    return removeEmptyObject(deleteNilValue(obj));
}

function deleteNilValue(obj) {
    _.each(obj, (value, key) => {
        if (_.isObject(value) && !(value instanceof Date)) {
            deleteNilValue(value);
        }
        if (value === null || value === undefined) {
            delete obj[key];
        }
    });
    return obj;
}

function removeEmptyObject(obj) {
    if (_.isArray(obj)) {
        return _(obj)
            .filter(_.isObject)
            .map(removeEmptyObject)
            .reject(_.isEmpty)
            .concat(_.reject(obj, _.isObject))
            .value();
    } 
    if (obj instanceof Date) {
        return obj;
    }
    return _(obj)
        .pickBy(_.isObject)
        .mapValues(removeEmptyObject)
        .omitBy(_.isEmpty)
        .assign(_.omitBy(obj, _.isObject))
        .value();
}


module.exports = {
    clean,
    prepareObjectAsAPIResponse,
    transformAttributesToPascalCase,
};
