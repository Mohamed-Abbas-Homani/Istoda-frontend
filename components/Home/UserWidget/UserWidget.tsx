import React from "react";
import Image from "next/image";
import { Users, BookOpen, PenTool } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

interface UserData {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  followers_count?: number;
  following_count?: number;
  stories_read?: number;
  stories_written?: number;
}

interface UserWidgetProps {
  user: UserData;
}

const UserWidget: React.FC<UserWidgetProps> = ({ user }) => {
  const {
    username,
    email,
    profilePicture,
    followers_count = 0,
    following_count = 0,
    stories_read = 0,
    stories_written = 0,
  } = user;

  return (
    <Card variant="neomorph" padding="lg" className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-xl">Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-neomorph">
            <Image
              src={
                profilePicture
                  ? `http://localhost:8000/uploads/${profilePicture}`
                  : "/default.png"
              }
              alt={`${username}'s profile`}
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold">{username}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Social Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <div className="text-2xl font-bold text-primary">{followers_count}</div>
            </div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-secondary/5 border border-secondary/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-secondary" />
              <div className="text-2xl font-bold text-secondary">{following_count}</div>
            </div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>

        {/* Story Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Stories Read</span>
            </div>
            <span className="text-lg font-bold text-accent">{stories_read}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/10">
            <div className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">Stories Written</span>
            </div>
            <span className="text-lg font-bold text-success">{stories_written}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserWidget;
