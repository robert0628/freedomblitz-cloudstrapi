'use strict';

/**
 * featured-post service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::featured-post.featured-post');
