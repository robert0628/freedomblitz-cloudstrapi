'use strict';

/**
 * top-pick service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::top-pick.top-pick');
