require('dotenv').config();

// const {RedisClient4} = require('../../services/redis4');
// const {RedisClient3} = require('../../services/redis3');
// const Slack = require('../../services/slack');
const responses = require('../../utils/responses');

/**
 * @param {Object} req - request object from incoming request
 * @param {string[]} source - data source
 * @return {Object} - generated arguments
 */
function generateFuncArguments(req, source) {
    let params;
    let query;
    let body;
    let url;
  
    source.map((val) => {
        if (val === 'params') {
            params = req[val];
        } else if (val === 'query') {
            query = req[val];
        } else if (val === 'body') {
            body = req[val];
        } else if (val === 'url') {
            url = req.originalUrl;
        }
    });
  
    return {
        params,
        query,
        body,
        url,
    };
}

/**
 * @param {Object} error - error object
 * @param {Object} req - request boject
 * @param {Object} carrier - error carrier
 * @return {Object} - response object
 */
// function handleCallbackError(error, req, carrier) {
//     Slack.send(error, req);
//     return responses.error(carrier);
// }

exports.get = (func, dataSource = [], saveToRedis = true, redisClient = 4) => {
    return async (req, res, next) => {
        const {params, query, body, url} = generateFuncArguments(req, dataSource);

        try {
            const data = await func(params, query, body, url);

            // Return 204 if there's no data
            if (!data) {
                return responses.empty(next);
            }

            if (process.env.NODE_ENV !== 'development') {
                if (saveToRedis) {
                    if (redisClient === 4) {
                        RedisClient4.set(req.originalUrl, {
                            responses: data,
                        }, RedisClient4.times._30day);
                    } else if (redisClient === 3) {
                        RedisClient3.set(req.originalUrl, {
                            responses: data,
                        }, RedisClient4.times._30day);
                    }
                }
            }

            return responses.ok(res, data);
        } catch (error) {
            console.log(error);
        }
    };
};

exports.patch = (func, ...dataSource) => {
    return async (req, res, next) => {
        const {params, query, body} = generateFuncArguments(req, dataSource);
        let key = req.originalUrl.replace(/\/[0-9]+(\/hide|\/unhide)/g, '');        
        var lastChar = key.toString().slice(-1);        
        if(!isNaN(parseInt(lastChar))){            
            key = key.substr(0, key.lastIndexOf('/'));
        }              
        try {
            await func(params, query, body);

            if (process.env.NODE_ENV !== 'development') {                
                RedisClient4.unlinkBasedOnPattern(0, `*${key}*`);
            }

            return responses.ok(res);
        } catch (error) {
            console.log(error);
        }
    }
};

exports.post = (func, ...dataSource) => {
    return async (req, res, next) => {
        const {params, query, body} = generateFuncArguments(req, dataSource);
  
        try {
            const data = await func(params, query, body);
            
            if (process.env.NODE_ENV !== 'development') {
                RedisClient4.unlinkBasedOnPattern(0, `*${req.originalUrl}*`);
            }
            
            if (data) {
                return responses.created(res, data);
            } else {
                return responses.created(res);
            }
        } catch (error) {
            console.log(error);
        }
    };
};
