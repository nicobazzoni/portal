import { getAuth, GoogleAuthProvider, signInWithPopup,  } from 'firebase/auth';
import firebase from 'firebase/app';
import { auth } from '../firebase';





const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Handle the user object as needed (e.g., store in your database)
      console.log('Successfully signed in with Google:', user);
      onSuccess(user); // Call your onSuccess callback
    } catch (error) {
      console.error('Error signing up with Google:', error);
      // Handle the error as needed
    }

    navigator.clipboard.writeText("Hello, world!");
  };

  
  

  const onSuccess = (user) => {
    // Handle the successful sign-in here, e.g., update the UI, set user state, etc.
    console.log("Sign-in successful:", user);
  };

const GoogleSignUp = () => {
  return (
    <div>
      <button
        onClick={handleGoogleSignUp}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Sign Up with Google
      </button>
    </div>
  );
};

export default GoogleSignUp;
