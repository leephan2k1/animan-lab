import usersRepository from "@/api/usersRepository";

const repositories = {
  users: usersRepository,
};

const RepositoryFactory = {
  get: (name) => repositories[name],
};

export default RepositoryFactory;
