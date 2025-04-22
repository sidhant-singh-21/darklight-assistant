import React from "react";
import { Card } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">👤 Your Profile</h1>

      <Card className="p-4 max-w-md">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="text-base font-medium">John Doe</p>

          <p className="text-sm text-muted-foreground mt-4">Email</p>
          <p className="text-base font-medium">john.doe@example.com</p>

          <p className="text-sm text-muted-foreground mt-4">Member Since</p>
          <p className="text-base font-medium">April 2024</p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
