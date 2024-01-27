const { User } = require('../models/User');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No user found with this email address');
      }

      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        throw new Error('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
