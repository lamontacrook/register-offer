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

function createPayload({ offerName, offer, startDate, endDate, group, priority }) {
  const placements = [
    'xcore:offer-placement:1882a924fc751e7e',
    'xcore:offer-placement:1882a9421d144edc',
    'xcore:offer-placement:1882a96401422d49',
    'xcore:offer-placement:1882a98432830ed5',
    'xcore:offer-placement:1882a9e332042f9d',
    'xcore:offer-placement:1882aa05cb535909'
  ];

  const representations = placements.map((item) => {
    return {
      "channel": "https://ns.adobe.com/xdm/channel-types/web",
      "placement": item,
      "components": [
        {
          "type": "https://ns.adobe.com/experience/offer-management/content-component-html",
          "format": "text/html",
          "language": [
            "en-us"
          ],
          "content": offer
        }
      ]
    }
  });

  return {
    "name": offerName,
    "status": "draft",
    "representations": representations,
    "selectionConstraint": {
      "startDate": startDate,
      "endDate": endDate,
      "profileConstraintType": "none"
    },
    "rank": {
      "priority": priority.includes('low') ? 5 : 10
    },
    "characteristics": {
      "category": group,
      "priority": priority
    },
    "cappingConstraint": {},
    "frequencyCappingConstraints": [
      {
        "enabled": false,
        "limit": 1,
        "startDate": startDate,
        "endDate": endDate,
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
}

async function main(params) {

  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    logger.info('Calling the main action');

    const requiredParams = ['startDate', 'endDate', 'offer', 'offerName', 'fragmentPath', 'altHeaders', 'aemHost', 'model', 'priority', 'group'];
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

    const { fragmentPath, altHeaders, aemHost, model } = params;

    const payload = createPayload(params);

    // logger.info(JSON.stringify(payload));

    // const _ret = {
    //   statusCode: 200,
    //   body: JSON.stringify(payload)
    // };
    // return _ret;

    const apiEndpoint = 'https://platform.adobe.io/data/core/dps/offers?offer-type=personalized';

    const res = await fetch(apiEndpoint, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-gw-ims-org-id': imsOrg,
        'x-sandbox-name': sandbox
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
    }
    const content = await res.json();
    const ret = {
      content: content
    };
    
    if (content) {
      const _payload = {
        "properties": {
          "cq:model": model,
          "elements": {
            "offerDelivery": {
              "value": JSON.stringify(content)
            },
          }
        }
      };

      const cfPath = fragmentPath.replace('/content/dam', '/api/assets');

      const frag = await fetch(aemHost + cfPath, {
        method: 'put',
        headers: JSON.parse(altHeaders),
        body: JSON.stringify(_payload)
      });
      ret['cf'] = await frag.json();
    } else
      throw new Error('request to update OD failed');

    const response = {
      statusCode: 200,
      body: ret
    };

    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main