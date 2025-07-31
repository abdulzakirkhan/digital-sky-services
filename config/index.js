
// import { APP_NAME_CODES } from './constants';

import { APP_NAME_CODES } from "./constants";

const baseUrl = 'https://staging.portalteam.org';


const appNameCode = APP_NAME_CODES.DIGITAL_SKY_SERVICES;
const appVersion = '2.2';

const webAppUrl = 'https://digitalskyservices.com/';
const androidAppUrl =
  'https://play.google.com/store/apps/details?id=com.digitalskyservices.android';
const iosAppUrl =
  'https://apps.apple.com/app/digital-sky-services/id6670388009';

let privacyPolicyLink = 'https://hybridresearchcenter.com/Privacypolicy';
if (appNameCode == APP_NAME_CODES.HYBRID_RESEARCH_CENTER)
  privacyPolicyLink = 'https://hybridresearchcenter.com/Privacypolicy';
else if (appNameCode == APP_NAME_CODES.DIGITAL_SKY_SERVICES)
  privacyPolicyLink = 'https://digitalskyservices.com/Privacypolicy';
else if (appNameCode == APP_NAME_CODES.EMIRATES_RESEARCH_CENTER)
  privacyPolicyLink = 'https://emiratesresearchcenter.com/Privacypolicy';

export {
  androidAppUrl,
  appNameCode,
  appVersion,
  baseUrl,
  iosAppUrl,
  privacyPolicyLink,
  webAppUrl,
};


