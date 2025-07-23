import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../Controller/postcontroller.js';

import verifyToken from '../../auth/middleware/jwtmiddleware.js'; // assumed to exist

const postrouter = express.Router();

postrouter.post('/', verifyToken, createPost);
postrouter.get('/',verifyToken, getAllPosts);
postrouter.get('/:id', getPostById);
postrouter.put('/:id', verifyToken, updatePost);
postrouter.delete('/:id', verifyToken, deletePost);

export default postrouter;
