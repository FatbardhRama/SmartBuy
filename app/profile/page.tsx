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

<main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">


<div className="mb-10 max-w-2xl">


<p className="text-sm font-semibold text-primary">Account settings</p>

<h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
My profile
</h1>


<p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
Manage your personal details, profile picture, and account security.
</p>


</div>



<ProfileForm initialUser={user}/>



</main>


);


}
