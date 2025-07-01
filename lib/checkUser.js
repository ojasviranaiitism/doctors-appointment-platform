import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
    const user = await currentUser();

    if (!user){
        return null;
    }

    try {
        const LoggedInUser = await db.user.findUnique({
            where:{
                clerkUserId : user.id,
            },
            include:{
                transactions:{
                    where:{
                        type: "CREDIT_PURCHASE",
                        createdAt:{
                            gte: new Date(new Date().getFullYear, new Date().getMonth, 1),
                        }
                    },
                    orderBy:{
                        createdAt: "desc",
                    },
                    take: 1, 
                },
            },
        });

        if(LoggedInUser){
            return LoggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        const newUser = await db.user.create({
            data:{
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddresses,
                transactions:{
                    create:{
                        type: "CREDIT_PURCHASE",
                        packageId: "free_user",
                        amount: 2,
                    }
                }
            }
        });

        return newUser;
    } catch (error) {
        console.log(error.message);
    }
}