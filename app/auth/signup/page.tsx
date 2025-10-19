"use client";

import Layout from "@/components/Layout/Layout";
import Signup from "@/components/Auth/Signup";

export default function SignupPage() {
  return (
    <Layout mode="notProtected">
      <Signup />
    </Layout>
  );
}
