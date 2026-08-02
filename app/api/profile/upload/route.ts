import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";


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



    const formData = await req.formData();


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



    const bytes = await file.arrayBuffer();


    const buffer = Buffer.from(bytes);




    const uploadResult =
      await new Promise<any>((resolve, reject)=>{


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
              else {

                resolve(result);

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