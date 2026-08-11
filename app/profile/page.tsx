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

<main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">


<div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10">
<div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
<div className="relative max-w-2xl">


<p className="sb-eyebrow">Account settings</p>

<h1 className="sb-heading-xl">
My profile
</h1>


<p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
Manage your personal details, profile picture, and account security.
</p>


</div>
</div>



<ProfileForm initialUser={user}/>



</main>


);


}
