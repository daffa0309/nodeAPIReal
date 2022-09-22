require('dotenv').config();
const express = require('express');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');
// const { adminPasienGigi, adminPasien } = require('../services/firebase');

// const Slack = require('../services/slack');

/**
 * Send back 401 or 403 response.
 * @param {status} number - HTTP Response Status
 * @param {express.NextFunction} next 
 */
async function _sendUnauthorizedResponse(status, next) {
    return next({
        status: status,
        message: 'Invalid Authorization.'
    })
}

/**
 * Capture client authorization from patient mobile app.
 * @param {string} audSource
 * @param {express.Request} req 
 * @param {express.NextFunction} next
 */
async function _patientAuth(audSource, req, next) {
    const token = req.headers.authorization.split(' ')[1];

    let fbAdmin;
    if (audSource === 'periksa-pasien') {
        fbAdmin = adminPasien;
    } else if (audSource === 'pasien-gigiid') {
        fbAdmin = adminPasienGigi;
    }

    let decodedToken;
    try {
        decodedToken = await fbAdmin.auth().verifyIdToken(token, true);
    } catch (error) {
        if (error.code === 'auth/id-token-revoked') {
            return _sendUnauthorizedResponse(403, next);
        }
    }
    
    if(decodedToken) {
        return next();
    }

    return _sendUnauthorizedResponse(403, next);
}

/**
 * Verify client authorization from clinic mobile app.
 * @param {express.Request} req 
 * @param {express.NextFunction} next 
 */
async function _clinicAuth(req, next) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return _sendUnauthorizedResponse(403, next);
        }
        // Authorization valid, continue.
        if (payload) return next();
        return _sendUnauthorizedResponse(403, next);
    });
}

/**
 * Core API Middleware, verify request authorization
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.authentication = async (req, res, next) => {
    try {
        if (req.headers['access-key']) {
            const accessKey = req.headers['access-key'];

            const id = process.env.KLINIK_ID;
            const password = process.env.KLINIK_PASS;
            const secret = process.env.KLINIK_SECRET;

            const key = crypto.createHmac('sha256', secret).update(`${id}:${password}`).digest('base64');            

            if (accessKey === key) {
                return next();
            } else {
                return _sendUnauthorizedResponse(401, next);
            }
        }
        else if (req.headers['authorization']) {
            const token = req.headers.authorization.split(' ')[1];
            const authPayload = jwt.decode(token);

            if (authPayload) {
                if (authPayload.app_source === 'mobile-klinik') {
                    await _clinicAuth(req, next);
                } else if (authPayload.aud === 'periksa-pasien' || authPayload.aud === 'pasien-gigiid') {
                    await _patientAuth(authPayload.aud, req, next);
                } else {
                    return next({
                        status: 400,
                        message: 'Token invalid',
                    });
                }
            } else {
                return _sendUnauthorizedResponse(403, next);
            }
        }
        else {
            return _sendUnauthorizedResponse(403, next);
        }
    }
    catch (e) {
        Slack.send(e, req);
        return next({
            status: 500,
            message: 'Internal server error.'
        });
    }
};

/** @deprecated Use `authentication` middleware instead. */
exports.userAuthorization = async (req, _, next) => {
    try {
        if (req.headers['authorization']) {
            const token = req.headers.authorization.split(' ')[1];

            let decodedToken;
            try {
                decodedToken = await adminPasien.auth().verifyIdToken(token, true);
            } catch (error) {
                if (error.code === 'auth/id-token-revoked') {
                    return next({
                        status: 403,
                        message: 'Unauthorized.'
                    });
                }
            }

            if (decodedToken) {
                return next();
            }

            return next({
                status: 403,
                message: 'Unauthorized.'
            });
        } else {
            return next({
                status: 403,
                message: 'Unauthorized.'
            });
        }
    }   
    catch (e) {
        Slack.send(e, req);
        return next({
            status: 500,
            message: 'Internal server error.'
        });
    }
};
