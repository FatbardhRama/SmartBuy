"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string | Date;
}

interface ProfileFormProps {
  initialUser: ProfileUser;
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProfileForm({
  initialUser,
}: ProfileFormProps) {

  const [name, setName] = useState(
    initialUser.name ?? ""
  );

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");


    try {

      const payload: Record<string, string> = {};


      if (name.trim()) {
        payload.name = name.trim();
      }


      if (password.trim()) {
        payload.password = password.trim();
      }


      if (
        Object.keys(payload).length === 0
      ) {
        setError(
          "Enter a name or a new password to update your profile."
        );

        return;
      }



      const response = await fetch(
        "/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );


      const data = await response.json();



      if (!response.ok) {

        setError(
          data.message ||
          "Unable to update profile."
        );

        return;
      }


      setMessage(
        data.message ||
        "Profile updated successfully."
      );


      setPassword("");


    } catch {

      setError(
        "Something went wrong while updating your profile."
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">


      <Card>

        <CardHeader>

          <CardTitle>
            Account Details
          </CardTitle>


          <CardDescription>
            Review your account information.
          </CardDescription>

        </CardHeader>



        <CardContent className="space-y-4">


          <div className="grid gap-2">

            <Label>
              Name
            </Label>

            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {initialUser.name || "Not provided"}
            </p>

          </div>



          <div className="grid gap-2">

            <Label>
              Email
            </Label>

            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {initialUser.email}
            </p>

          </div>




          <div className="grid gap-2">

            <Label>
              Role
            </Label>

            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm capitalize">
              {initialUser.role.toLowerCase()}
            </p>

          </div>




          <div className="grid gap-2">

            <Label>
              Member Since
            </Label>

            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {formatDate(initialUser.createdAt)}
            </p>

          </div>



        </CardContent>

      </Card>





      <Card>

        <CardHeader>

          <CardTitle>
            Update Profile
          </CardTitle>


          <CardDescription>
            Change your name or password.
          </CardDescription>


        </CardHeader>



        <CardContent>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            <div className="space-y-2">

              <Label htmlFor="name">
                Name
              </Label>


              <Input

                id="name"

                value={name}

                onChange={(e) =>
                  setName(e.target.value)
                }

                placeholder="Enter your name"

              />

            </div>





            <div className="space-y-2">


              <Label htmlFor="password">
                New Password
              </Label>


              <Input

                id="password"

                type="password"

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }

                placeholder="Leave empty to keep current"

              />


            </div>





            {error && (

              <p className="text-sm text-red-500">
                {error}
              </p>

            )}





            {message && (

              <p className="text-sm text-green-600">
                {message}
              </p>

            )}





            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : "Save Changes"}

            </Button>




          </form>


        </CardContent>


      </Card>


    </div>

  );

}