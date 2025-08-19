import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center mt-20">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Istoda!</h1>
        <p className="text-lg">
          Your awesome Next.js app with backend at localhost:8000
        </p>
      </div>
    </Layout>
  );
}
