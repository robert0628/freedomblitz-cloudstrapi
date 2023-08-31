'use strict';

/**
 * money-maker service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::money-maker.money-maker');
