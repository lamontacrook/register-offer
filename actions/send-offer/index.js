/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, getApiKey, getImsOrg, getSandbox, stringParameters, checkMissingRequestInputs } = require('../utils')

async function main(params) {

  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    logger.info('Calling the main action');
    // logger.debug(stringParameters(params));

    const requiredParams = ['startDate', 'endDate', 'offer'];
    const requiredHeaders = ['Authorization'];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders);
    const token = getBearerToken(params);
    const apiKey = getApiKey(params);
    const imsOrg = getImsOrg(params);
    const sandbox = getSandbox(params);

    logger.info(apiKey);
    logger.info(imsOrg);
    logger.info(sandbox);

    if (errorMessage) return errorResponse(400, 'oops ' + errorMessage, logger);

    const { startDate, endDate, offer } = params;

    const payload = {
      "name": "BBW Test 1",
      "status": "draft",
      "representations": [
        {
          "channel": "https://ns.adobe.com/xdm/channel-types/web",
          "placement": "xcore:offer-placement:15dc0f34728a742a",
          "components": [
            {
              "type": "https://ns.adobe.com/experience/offer-management/content-component-text",
              "format": "text/plain",
              "language": [
                "en-us"
              ],
              "content": offer
            }
          ]
        }
      ],
      "selectionConstraint": {
        "startDate": "2022-07-27T05:00:00.000+00:00",
        "endDate": "2023-07-29T05:00:00.000+00:00",
        "profileConstraintType": "none"
      },
      "rank": {
        "priority": 0
      },
      "cappingConstraint": {},
      "frequencyCappingConstraints": [
        {
          "enabled": false,
          "limit": 1,
          "startDate": "2024-05-15T14:25:49.622+00:00",
          "endDate": "2024-05-25T14:25:49.622+00:00",
          "scope": "global",
          "entity": "offer",
          "repeat": {
            "enabled": false,
            "unit": "month",
            "unitCount": 1
          }
        }
      ]
    };


    const apiEndpoint = 'https://platform.adobe.io/data/core/dps/offers?offer-type=personalized';

    const res = await fetch(apiEndpoint, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-api-key': '3af35f9c2dac45008506d484731aba13',
        'x-gw-ims-org-id': '120A56765E16E7BE0A495FEB@AdobeOrg',
        'x-sandbox-name': 'kabbeysbox'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
    }
    const content = await res.json();
    const response = {
      statusCode: 200,
      body: content
    };

    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main