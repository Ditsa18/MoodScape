import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const waitForAuth = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
