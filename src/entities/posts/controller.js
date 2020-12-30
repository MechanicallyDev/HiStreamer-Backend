const fs = require('fs');
const userDAO = require('../../database/mongoDB/userSchema');
const postDAO = require('../../database/mongoDB/postSchema');

module.exports = {
  async index(req, res) {
    let { page = 1 } = req.query;
    const itemsPerPage = 6;
    const count = await postDAO.countDocuments();
    if (page <= 0) page = 1;
    if (count < page * itemsPerPage)
      page = 1 + Math.floor(count / itemsPerPage);
    const posts = await postDAO
      .find({}, 'title description image slug -_id')
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.header('X-Total-Count', count);
    return res.json(posts);
  },

  async read(req, res) {
    try {
      const { slug } = req.params;
      let authorInfo404 = {
        name: 'HiStreamer.com',
        picture: '',
      };
      let postInfo404 = {
        title: 'Page not found',
        author: 'HiStreamer.com',
        image: '',
        slug,
        created_at: new Date(),
        updated_at: new Date(),
      };
      let authorInfo = {};
      let postInfo = await postDAO.findOne(
        { slug },
        'title author image slug created_at updated_at -_id'
      );
      if (postInfo !== null) {
        authorInfo = await userDAO.findOne(
          { id: postInfo.author },
          'name picture -_id'
        );
      }

      if (
        !postInfo ||
        !fs.existsSync(`public/posts/${slug}/${slug}.md` || !authorInfo)
      ) {
        return res.json({ post: postInfo404, author: authorInfo404 });
      }

      delete postInfo.author;
      return res.json({ post: postInfo, author: authorInfo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    const token = req.headers.authorization;
    const author = req.user.id;
    const { title, description, image, slug } = req.body;
    const created_at = new Date();
    const updated_at = new Date();
    const createdPost = await postDAO.create({
      title,
      description,
      image,
      slug,
      author,
      created_at,
      updated_at,
    });

    const { _id } = createdPost;
    await userDAO.findByIdAndUpdate(_id, { id: _id });
    res.status(201).json();
  },

  async delete(req, res) {
    const token = req.headers.authorization;
    const { id } = req.params;
    const reqAuthor = req.user.id;

    const post = await postDAO.findOne({ _id: id });

    if (post.author !== reqAuthor)
      return res.status(401).json({ error: 'Operation not permitted' });

    await postDAO.deleteOne({ _id: id });
    return res.status(204).send();
  },
};
