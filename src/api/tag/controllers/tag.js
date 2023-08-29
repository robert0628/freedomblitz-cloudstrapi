'use strict';

module.exports = {
  getTags: async (ctx, next) => {
    try {
        const tags = await strapi.entityService.findMany('api::tag.tag', {
            populate: ['parent']
        });

        ctx.body = {
            tags,
        };
    } catch (err) {
        console.log(err);
        ctx.body = err;
    }
  }
};
