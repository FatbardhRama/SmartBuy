"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, LockKeyhole, Mail, ShieldCheck, UploadCloud, UserRound } from "lucide-react";

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
  image: string | null;
  role: string;
  createdAt: string | Date;
}


interface ProfileFormProps {
  initialUser: ProfileUser;
}



function formatDate(date: string | Date) {

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

}



export function ProfileForm({
  initialUser,
}: ProfileFormProps) {


  const [name, setName] = useState(
    initialUser.name ?? ""
  );


  const [password, setPassword] = useState("");


  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);


  const [preview, setPreview] =
    useState(
      initialUser.image ?? ""
    );


  const [loading, setLoading] =
    useState(false);


  const [message, setMessage] =
    useState("");


  const [error, setError] =
    useState("");





  async function handleImageUpload() {

    if (!selectedImage) {
      return;
    }


    try {

      setLoading(true);
      setError("");
      setMessage("");


      const formData = new FormData();


      formData.append(
        "file",
        selectedImage
      );



      const response = await fetch(
        "/api/profile/upload",
        {
          method: "POST",
          body: formData,
        }
      );



      const data = await response.json();



      if (!response.ok) {

        setError(
          data.message ||
          "Image upload failed."
        );

        return;
      }



      setPreview(data.image);


      setSelectedImage(null);


      setMessage(
        "Profile picture updated successfully."
      );


      window.location.reload();
    } catch {

      setError(
        "Something went wrong while uploading image."
      );


    } finally {

      setLoading(false);

    }

  }






  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    setLoading(true);

    setMessage("");

    setError("");



    try {


      const payload: Record<string,string> = {};



      if (name.trim()) {

        payload.name =
          name.trim();

      }



      if (password.trim()) {

        payload.password =
          password.trim();

      }




      if (
        Object.keys(payload).length === 0
      ) {

        setError(
          "Enter a name or a new password."
        );

        return;

      }




      const response =
        await fetch(
          "/api/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );





      const data =
        await response.json();




      if (!response.ok) {

        setError(
          data.message ||
          "Profile update failed."
        );

        return;

      }





      setMessage(
        "Profile updated successfully."
      );


      setPassword("");



    } catch {


      setError(
        "Something went wrong."
      );


    } finally {


      setLoading(false);


    }


  }






  return (

    <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">



      <Card className="overflow-hidden rounded-[1.5rem] border-0 ring-1 ring-border/80 shadow-[0_20px_52px_-42px_rgba(15,23,42,0.38)]">

        <CardHeader className="border-b border-border/70 pb-5">

          <CardTitle>
            Account details
          </CardTitle>


          <CardDescription>
            Your identity and membership information.
          </CardDescription>

        </CardHeader>



        <CardContent className="space-y-6 pt-1">


          <div className="rounded-2xl bg-muted/45 p-5 ring-1 ring-border/70">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">


            {preview ? (

              <Image

                src={preview}

                alt="Profile picture"

                width={112}

                height={112}

                unoptimized

                className="size-28 shrink-0 rounded-2xl object-cover ring-1 ring-border"

              />

            ) : (

              <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-card text-muted-foreground ring-1 ring-border">
                <UserRound className="size-9" aria-label="No profile picture" />
              </div>

            )}


            <div className="w-full min-w-0 space-y-3">
            <div><p className="text-sm font-semibold">Profile picture</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose an image, preview it, then upload to save.</p></div>
            <Input

              type="file"

              accept="image/*"

              onChange={(e)=>{

                const file =
                  e.target.files?.[0];


                if(file){

                  setSelectedImage(file);


                  setPreview(
                    URL.createObjectURL(file)
                  );

                }

              }}
              className="h-11 w-full rounded-xl bg-card file:mr-3"

            />





            <Button

              type="button"

              onClick={handleImageUpload}

              disabled={
                !selectedImage ||
                loading
              }
              className="w-full gap-2 rounded-xl sm:w-auto"

            >

              {loading
                ? "Uploading..."
                : <><UploadCloud className="size-4" aria-hidden="true" /> Upload picture</>}

            </Button>
            </div>
          </div>
          </div>





          <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/70">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground"><UserRound className="size-4 text-primary" aria-hidden="true" /> Name</Label>
            <p className="mt-2 truncate text-sm font-semibold">

              {initialUser.name || "Not provided"}

            </p>

          </div>
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/70">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-4 text-primary" aria-hidden="true" /> Email</Label>
            <p className="mt-2 truncate text-sm font-semibold">

              {initialUser.email}

            </p>

          </div>
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/70">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Role</Label>
            <p className="mt-2 text-sm font-semibold capitalize">

              {initialUser.role.toLowerCase()}

            </p>

          </div>
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/70">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4 text-primary" aria-hidden="true" /> Member since</Label>
            <p className="mt-2 text-sm font-semibold">

              {formatDate(initialUser.createdAt)}

            </p>

          </div>
          </div>




        </CardContent>

      </Card>






      <Card className="overflow-hidden rounded-[1.5rem] border-0 ring-1 ring-border/80 shadow-[0_20px_52px_-42px_rgba(15,23,42,0.38)] lg:sticky lg:top-24">

        <CardHeader className="border-b border-border/70 pb-5">

          <CardTitle>
            Update profile
          </CardTitle>


          <CardDescription>
            Change your display name or account password.
          </CardDescription>


        </CardHeader>




        <CardContent className="pt-1">


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            <div className="space-y-2">

              <Label htmlFor="profile-name">
                Name
              </Label>


              <Input
                id="profile-name"
                value={name}

                onChange={(e)=>
                  setName(e.target.value)
                }

                autoComplete="name"
                className="h-11 rounded-xl bg-background"
              />

            </div>





            <div className="space-y-2">

              <Label htmlFor="profile-password" className="flex items-center gap-2">
                <LockKeyhole className="size-4 text-primary" aria-hidden="true" /> New password
              </Label>


              <Input
                id="profile-password"
                type="password"

                value={password}

                onChange={(e)=>
                  setPassword(e.target.value)
                }

                autoComplete="new-password"
                placeholder="Leave blank to keep your current password"
                className="h-11 rounded-xl bg-background"
              />

            </div>





            {error && (

              <p className="rounded-xl bg-destructive/8 p-3 text-sm text-destructive" role="alert">
                {error}
              </p>

            )}





            {message && (

              <p className="rounded-xl bg-success/8 p-3 text-sm text-green-700 dark:text-green-300" role="status">
                {message}
              </p>

            )}





            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : "Save changes"}

            </Button>



          </form>


        </CardContent>


      </Card>



    </div>

  );

}
