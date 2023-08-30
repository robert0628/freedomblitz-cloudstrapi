'use strict';

/**
 * A set of functions called "actions" for `landing-data`
 */

module.exports = {
  landingPageData: async (ctx, next) => {
    try {
      const editorPicks = await strapi.entityService.findMany('api::editor-pick.editor-pick', {
        populate: ['post.main_image', 'post.by', 'post.tag']
      })
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
      const featuredPosts = await strapi.entityService.findMany('api::featured-post.featured-post', {
        populate: ['post.main_image', 'post.by', 'post.tag'],
        filters: {
          post: {
            tag: {
              title: {
                $in: ['Investments', 'Marketing', 'Sales']
              }
            }
          }
        }
      })
      ctx.body = {
        editorPicks,
        latestPosts,
        featuredPosts,
      };
    } catch (err) {
      ctx.body = err;
    }
  }
};
