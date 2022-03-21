import usersRepository from "@/api/usersRepository";
import postRepository from "@/api/postRepository";

const repositories = {
  users: usersRepository,
  posts: postRepository,
};

const RepositoryFactory = {
  get: (name) => repositories[name],
};

export default RepositoryFactory;
