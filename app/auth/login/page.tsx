"use client";

import Layout from "@/app/components/Layout/Layout";
import Login from "@/app/components/Auth/Login";

export default function LoginPage() {
  return (
    <Layout mode="notProtected">
      <Login />
    </Layout>
  );
}
