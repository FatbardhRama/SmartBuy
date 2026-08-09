import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { UploadApiResponse } from "cloudinary";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);


export async function POST(req: Request) {

  try {

    const session = await getServerSession(authOptions);


    if (!session?.user?.id) {

      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    let formData: FormData;

    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid upload request",
        },
        {
          status: 400,
        }
      );
    }


    const file = formData.get("file");



    if (!file || !(file instanceof File)) {

      return NextResponse.json(
        {
          message: "No file uploaded",
        },
        {
          status: 400,
        }
      );

    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          message: "Only JPEG, PNG, or WebP images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      return NextResponse.json(
        {
          message: "Profile image must be 2 MB or smaller",
        },
        {
          status: 413,
        }
      );
    }



    const bytes = await file.arrayBuffer();


    const buffer = Buffer.from(bytes);




    const uploadResult =
      await new Promise<UploadApiResponse>((resolve, reject)=>{


        cloudinary.uploader
          .upload_stream(
            {
              folder:
                "smartbuy/profile-images",
            },


            (error,result)=>{


              if(error){

                reject(error);

              }
              else if (result) {

                resolve(result);

              }
              else {

                reject(new Error("Cloudinary upload returned no result"));

              }


            }

          )
          .end(buffer);



      });





    const imageUrl =
      uploadResult.secure_url;




    await prisma.user.update({

      where:{
        id: session.user.id,
      },


      data:{
        image:imageUrl,
      },


    });





    return NextResponse.json({

      message:
        "Profile picture updated successfully",

      image:imageUrl,

    });



  }
  catch(error){


    console.error(error);


    return NextResponse.json(

      {
        message:"Upload failed",
      },

      {
        status:500,
      }

    );

  }


}
