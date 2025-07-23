// src/utils/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

import User from '../auth/modles/user.js';
import Post from '../Posts/Model/Postmodel.js';
import Like from '../Likes/Models/likes.js';
import Follow from '../Follow/Model/follow.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Post.deleteMany();
    await Like.deleteMany();
    await Follow.deleteMany();
    console.log('🧹 Cleared old data');

    const dummyPasswords = ['alpha1234', 'beta1234', 'gamma1234', 'delta1234', 'omega1234'];
    const users = [];

    for (let i = 0; i < 5; i++) {
      const password = dummyPasswords[i];

      const user = new User({
        email: faker.internet.email(),
        password, // ✅ Just set plain password - pre('save') will hash
      });

      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.email} | Password: ${password}`);
    }

    const posts = [];
    for (let user of users) {
      for (let i = 0; i < 2; i++) {
        const post = new Post({
          content: faker.lorem.sentence(),
          author: user._id,
          image: faker.image.url(),
        });
        await post.save();
        posts.push(post);
      }
    }

    console.log('📝 Posts created');

    for (let post of posts) {
      const randomUsers = faker.helpers.shuffle(users).slice(0, 2);
      for (let user of randomUsers) {
        const like = new Like({
          user: user._id,
          targetType: 'Post',
          targetId: post._id,
        });
        await like.save();

        post.likes.push(user._id);
      }
      await post.save();
    }

    console.log('❤️ Likes added');

    for (let follower of users) {
      const following = users.filter(u => u._id.toString() !== follower._id.toString());
      const followSample = faker.helpers.shuffle(following).slice(0, 2);
      for (let followee of followSample) {
        const follow = new Follow({
          follower: follower._id,
          following: followee._id,
        });
        await follow.save();
      }
    }

    console.log('🔗 Follow relationships created');
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
    process.exit(1);
  }
};

seed();
