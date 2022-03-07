import { ref } from "vue";
import RepositoryFactory from "@/api/repositoryFactory";

const err = ref(null);
const isPending = ref(null);
const userRepository = RepositoryFactory.get("users");

const signUp = async (user) => {
  err.value = null;
  isPending.value = true;
  try {
    const res = await userRepository.register(user);
    if (!res) throw new Error("Could not create user");
    return res;
  } catch (err) {
    console.log(err);
    err.value = err;
  } finally {
    isPending.value = false;
  }
};

export default function useSignUp() {
  return { signUp, err, isPending };
}
