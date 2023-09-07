'use strict';

/**
 * A set of functions called "actions" for `search-suggestions`
 */

module.exports = {
  searchSuggestions: async (ctx, next) => {
    try {
      const { query } = ctx.query

      const suggestions = await strapi.db.query('api::post.post').findMany({
        select: ["id", "title", "description"],
        populate: {
          // @ts-ignore
          main_image: { select: ["id", "url", "width", "height"] },
          tag: { 
            select: ["id", "title"], 
              
            // include: {
            //   parent: { select: ["title"] }
            // } 
          },
          by: { select: ["id", "username"] }
        },
        where: {
          $or: [
            { title: { $containsi: query } },
            { tag: { title: { $containsi: query } } },
            { by: { username:  { $containsi : query }}},
            { tag: { parent: { title: { $containsi: query } } } }
          ]
        },
        limit: 6,
      })

      ctx.body = suggestions;
    } catch (err) {
      ctx.body = err;
    }
  }
};
