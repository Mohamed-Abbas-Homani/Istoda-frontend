"use client";

import Layout from "@/app/components/Layout/Layout";
import Signup from "@/app/components/Auth/Signup";

export default function SignupPage() {
  return (
    <Layout mode="notProtected">
      <Signup />
    </Layout>
  );
}
