import * as postRepository from '../Repository/Postrepository.js';
import LikeModel from '../../Likes/Models/likes.js';

// POST /api/posts
export const createPost = async (req, res) => {
  try {
      const { content } = req.body;
      console.log(req.user)
    const post = await postRepository.createPost({ content, author: req.user.userId});
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/posts
export const getAllPosts = async (req, res) => {
  console.log(req.user)
  try {
    const posts = await postRepository.findAllPosts();
    const postwithlikes = await Promise.all(posts.map(async (post) => {
      const likes = await LikeModel.countDocuments({
        targetType: 'Post',
        targetId: post._id
      });
      let likedByCurrentUser = false;
      if (req.user && req.user.userId) {
        likedByCurrentUser = await LikeModel.exists({
          targetType: 'Post',
          targetId: post._id,
          user: req.user.userId
        });
      }
      return { ...post.toObject(), likes, likedByCurrentUser: !!likedByCurrentUser };
    }));
    return res.status(200).json(postwithlikes);
  } catch (err) {
    console.error('Error getting posts:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await postRepository.findPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await postRepository.findPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await postRepository.updatePostById(req.params.id, { content: req.body.content });
    res.status(200).json({ message: 'Post updated', post: updated });
  } catch (err) {
    console.error('Error updating post:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
      const post = await postRepository.findPostById(req.params.id);
      console.log(post.author._id.toString(), req.user.userId)
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author || post.author._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await postRepository.deletePostById(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
