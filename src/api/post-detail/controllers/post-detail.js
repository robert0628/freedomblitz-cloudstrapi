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
      const topPicks = await strapi.entityService.findMany('api::top-pick.top-pick', {
        populate: ['post.main_image', 'post.by', 'post.tag']
      });
      ctx.body = {
        latestPosts,
        topPicks,
      }
    } catch (err) {
      ctx.body = err;
    }
  }
};
