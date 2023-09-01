'use strict';

/**
 * A set of functions called "actions" for `post-detail`
 */

module.exports = {
  postDetail: async (ctx, next) => {
    try {
      const { id } = ctx.params
      const latestPosts = await strapi.entityService.findMany('api::post.post', {
        fields: ['title'],
        populate: {
          tag: true,
          by: true,
          main_image: true
        },
        limit: 6,
        sort: [{ title: 'asc' }, { publishedAt: 'desc' }]
      })
      ctx.body = {
        latestPosts
      }
    } catch (err) {
      ctx.body = err;
    }
  }
};
