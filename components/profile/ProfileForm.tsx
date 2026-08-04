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

    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">



      <Card>

        <CardHeader>

          <CardTitle>
            Account Details
          </CardTitle>


          <CardDescription>
            Your account information.
          </CardDescription>

        </CardHeader>



        <CardContent className="space-y-6">


          <div className="flex flex-col items-center gap-4">


            {preview ? (

              <img

                src={preview}

                alt="Profile picture"

                className="h-32 w-32 rounded-full object-cover border"

              />

            ) : (

              <div className="h-32 w-32 rounded-full border flex items-center justify-center text-sm">

                No Image

              </div>

            )}





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
              className="w-full"

            />





            <Button

              type="button"

              onClick={handleImageUpload}

              disabled={
                !selectedImage ||
                loading
              }
              className="w-full sm:w-auto"

            >

              {loading
                ? "Uploading..."
                : "Upload Picture"}

            </Button>


          </div>





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
            Change name or password.
          </CardDescription>


        </CardHeader>




        <CardContent>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            <div className="space-y-2">

              <Label>
                Name
              </Label>


              <Input

                value={name}

                onChange={(e)=>
                  setName(e.target.value)
                }

              />

            </div>





            <div className="space-y-2">

              <Label>
                New Password
              </Label>


              <Input

                type="password"

                value={password}

                onChange={(e)=>
                  setPassword(e.target.value)
                }

              />

            </div>





            {error && (

              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>

            )}





            {message && (

              <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
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
