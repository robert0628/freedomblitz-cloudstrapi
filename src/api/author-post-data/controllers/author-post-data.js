'use strict';

/**
 * A set of functions called "actions" for `author-post-data`
 */

module.exports = {
  getAuthorWithPosts: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      let { page = 1, pageSize = 24 } = ctx.query;
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
        fields: ['username', 'bio', 'instagram', 'facebook', 'linkedin', 'twitter'],
        populate: { image: true }
      });
      const totalPostsByUser = await strapi.entityService.findMany('api::post.post', {
        filters: { by: { id: { $eq: id } } }, fields: ['id']
      })
      const posts = await strapi.entityService.findMany('api::post.post', {
        start: (page-1)*pageSize, limit: pageSize,
        filters: { by: { id: { $eq: id } } },
        fields: ['title', 'id'],
        populate: { main_image: true, tag: true, by: { fields: ["username", "id"] } }
      });
      ctx.body = {
        user,
        posts,
        totalPostsByUser: totalPostsByUser?.length || 0,
      };
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
