"use client";

import Layout from "@/components/Layout/Layout";
import Login from "@/components/Auth/Login";

export default function LoginPage() {
  return (
    <Layout mode="notProtected">
      <Login />
    </Layout>
  );
}
