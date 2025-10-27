"use client";
import React from "react";
import UserWidget from "./UserWidget/UserWidget";
import StoriesFeed from "./StoriesFeed/StoriesFeed";
import { useAuthStore } from "@/services/stores";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-full min-h-screen px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar - User Widget */}
        <aside className="lg:col-span-3">
          {user && <UserWidget user={user} />}
        </aside>

        {/* Main content - Stories Feed */}
        <main className="lg:col-span-6">
          <StoriesFeed />
        </main>

        {/* Right sidebar - Networks */}
        <aside className="lg:col-span-3 hidden lg:block">
          <Card variant="neomorph" padding="lg" className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl">Networks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connections, trending users, and more coming soon...
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Home;
