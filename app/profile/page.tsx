import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/ProfileForm";


export default async function ProfilePage(){


const session =
await getServerSession(authOptions);



if(!session?.user){

redirect("/login");

}



const user =
await prisma.user.findUnique({

where:{
id:session.user.id,
},


select:{

id:true,
name:true,
email:true,
image:true,
role:true,
createdAt:true,

},


});



if(!user){

redirect("/login");

}




return(

<main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">


<div className="mb-8">


<h1 className="text-3xl font-bold">
My Profile
</h1>


<p className="text-sm text-muted-foreground">
Update your account details and profile picture.
</p>


</div>



<ProfileForm initialUser={user}/>



</main>


);


}
