import usersRepository from "@/api/usersRepository";
import postRepository from "@/api/postRepository";
import commentRepository from "@/api/commentRepository";

const repositories = {
  users: usersRepository,
  posts: postRepository,
  comments: commentRepository,
};

const RepositoryFactory = {
  get: (name) => repositories[name],
};

export default RepositoryFactory;
