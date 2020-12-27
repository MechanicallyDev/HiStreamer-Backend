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
      .find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.header('X-Total-Count', count);
    return res.json(posts);
  },

  async read(req, res) {
    try {
      const { slug } = req.params;

      let postInfo = await postDAO.findOne({ slug });
      if (!postInfo || !fs.existsSync(`public/posts/${slug}/${slug}.md`)) {
        return res.status(404).send();
      }
      let authorInfo = await userDAO.findOne({ name: postInfo.author });

      postInfo.postURL = `${process.env.HOST}:${process.env.PORT}/posts/${slug}/${slug}.md`;
      return res.json({ post: postInfo, author: authorInfo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    const { title, description, image, slug } = req.body;
    const token = req.headers.authorization;
    const createdPost = await postDAO.create({
      id: '0',
      title,
      description,
      image,
      slug,
      author: req.user.id,
    });

    const { _id } = createdPost;
    await userDAO.findByIdAndUpdate(_id, { id: _id });
    res.status(201).json();
  },
  async delete(req, res) {
    const { id } = req.params;
    const token = req.headers.authorization;

    const post = await postDAO.findOne({ _id: id });
    if (post.author !== req.user.id)
      return res.status(401).json({ error: 'Operation not permitted' });
    await postDAO.deleteOne({ _id: id });
    return res.status(204).send();
  },
};
