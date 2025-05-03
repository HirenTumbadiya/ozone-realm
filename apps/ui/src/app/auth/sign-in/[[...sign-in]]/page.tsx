import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>Sign In | OZONE-REALM</title>
        <meta
          name="description"
          content="Sign in to OZONE-REALM to continue your journey!"
        />
      </Head>
      <div className="h-screen w-screen flex items-center justify-center bg-black/90 backdrop-blur">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <SignIn signUpUrl="/auth/sign-up" />
        </div>
      </div>
    </>
  );
}
