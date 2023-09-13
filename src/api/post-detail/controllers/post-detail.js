'use strict';

/**
 * A set of functions called "actions" for `post-detail`
 */

module.exports = {
  postDetail: async (ctx, next) => {
    try {
      const { id } = ctx.params
      const post = await strapi.db.query('api::post.post').findOne({
        where: { id },
        populate: [
          'main_image',
          'by.image',
          'tag',
          'contributors.image',
          'accordian.qas',
          'boxed_content.content',
          'bottom_media.image',
          "lead_para.highlight", "lead_para.link", "body_paras.highlight", "body_paras.link", "quote.by.image", "end_paras.highlight", "end_paras.link",
          "table.row",
          "numbered_section",
          "contents_links",
          "source_links",
        ],
      });

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
        populate: ['post.main_image', 'post.by.image', 'post.tag'],
      });
      const details = await strapi.db.query('api::post.post').findMany({
        where: {
          id,
        },
        // @ts-ignore
        populate: { bottom_media: true }
      })
      const relatedPosts = await strapi.db.query('api::post.post').findMany({
        select: ["id", "title", "description"],
        populate: {
          // @ts-ignore
          main_image: { select: ["id", "url", "width", "height"] },
          tag: { select: ["id", "title"] },
          by: { select: ["id", "username"] }
        },
        where: {
          $or: [
            { title: { $containsi: details?.[0]?.title } },
            { tag: { title: { $containsi: details?.[0]?.title } } },
          ]
        },
        limit: 6,
      })
      ctx.body = {
        post,
        latestPosts,
        topPicks,
        relatedPosts,
        details: details?.[0]
      }
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
