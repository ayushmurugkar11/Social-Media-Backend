import Post from '../Model/Postmodel.js';

export const createPost = async (data) => {
  const post = new Post(data);
  return await post.save();
};

export const findAllPosts = async () => {
  return await Post.find().populate('author', 'username profilePicture').sort({ createdAt: -1 });
};

export const findPostById = async (id) => {
  return await Post.findById(id).populate('author', 'username profilePicture');
};

export const updatePostById = async (id, data) => {
  return await Post.findByIdAndUpdate(id, data, { new: true });
};

export const deletePostById = async (id) => {
  return await Post.findByIdAndDelete(id);
};
