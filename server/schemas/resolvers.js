const User = require('../models/User');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    me: async (parent, context) => {
      try {
        if (!context.user) {
          return null;
        }
        return await User.findById(context.user._id);
      } catch (error) {
        console.error("Error in me resolver:", error);
        throw new Error('Error fetching user data');
      }
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with this email address');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error("Error in login resolver:", error);
        throw new Error('Error during login');
      }
    },

    addUser: async (parent, { username, email, password }) => {
      try {
        console.log('Adding user:', username, email, password);
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error("Error in addUser resolver:", error);
        throw new Error('Error creating user');
      }
    },

    saveBook: async (parent, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Not authenticated');
        }
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (error) {
        console.error("Error in saveBook resolver:", error);
        throw new Error('Error saving book');
      }
    },

    removeBook: async (parent, { bookId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Not authenticated');
        }
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      } catch (error) {
        console.error("Error in removeBook resolver:", error);
        throw new Error('Error removing book');
      }
    },
  },
};

module.exports = resolvers;
