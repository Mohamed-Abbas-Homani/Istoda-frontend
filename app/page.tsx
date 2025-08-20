'use client';

import Layout from "./components/Layout/Layout";
import Welcome from "./components/Welcome/Welcome";

export default function WelcomePage() {

  return (
    <Layout withNav={false}>
      <Welcome />
    </Layout>
  );
}
