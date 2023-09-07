'use strict';

/**
 * A set of functions called "actions" for `category-data`
 */

module.exports = {
  categoryData: async (ctx, next) => {
    try {
      let { category, page = 1, pageSize = 24 } = ctx.query;
      category = category.split('-').join(' ')
      if(category === "all posts") {
        const posts = await strapi.db.query('api::post.post').findMany({
          select: ["id", "title", "description"],
          populate: {
            // @ts-ignore
            main_image: { select: ["id", "url", "width", "height"] },
            tag: { select: ["id", "title"] },
            by: { select: ["id", "username"] }
          },
          offset: (page-1)*pageSize, limit: pageSize,
        })
        ctx.body = { posts }
        return
      }
      const posts = await strapi.db.query('api::post.post').findMany({
        select: ["id", "title", "description"],
        populate: {
          // @ts-ignore
          main_image: { select: ["id", "url", "width", "height"] },
          tag: { select: ["id", "title"] },
          by: { select: ["id", "username"] }
        },
        where: {
          tag: { title: { $containsi: category } }
        },
        offset: (page-1)*pageSize, limit: pageSize,
      })
      ctx.body = {
        posts
      };
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
