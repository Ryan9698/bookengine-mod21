// import user model
import { User } from '../models';
// import sign token function from auth
import { signToken } from '../utils/auth';

export
  // get a single user by either their id or their username
  async function getSingleUser({ user = null, params }, res) {
  console.log("getSingleUser function called");
  const foundUser = await User.findOne({
    $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
  });

  if (!foundUser) {
    console.log("Cannot find a user with this id!");
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  res.json(foundUser);
}
export
  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async function createUser({ body }, res) {
  console.log("createUser function called");
  const user = await User.create(body);

  if (!user) {
    console.log("Something is wrong!");
    return res.status(400).json({ message: 'Something is wrong!' });
  }
  const token = signToken(user);
  res.json({ token, user });
}
export
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async function login({ body }, res) {
  console.log("login function called");
  const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
  if (!user) {
    console.log("Can't find this user");
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(body.password);

  if (!correctPw) {
    console.log("Wrong password!");
    return res.status(400).json({ message: 'Wrong password!' });
  }
  const token = signToken(user);
  res.json({ token, user });
}
export
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async function saveBook({ user, body }, res) {
  console.log("saveBook function called");
  console.log(user);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { savedBooks: body } },
      { new: true, runValidators: true }
    );
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
}
export
  // remove a book from `savedBooks`
  async function deleteBook({ user, params }, res) {
  console.log("deleteBook function called");
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { savedBooks: { bookId: params.bookId } } },
    { new: true }
  );
  if (!updatedUser) {
    console.log("Couldn't find user with this id!");
    return res.status(404).json({ message: "Couldn't find user with this id!" });
  }
  return res.json(updatedUser);
}