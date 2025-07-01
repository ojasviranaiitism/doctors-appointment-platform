"use server"

import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns"

// Define credit allocations per plan
const PLAN_CREDITS = {
    free_user : 0, // Basic plan : 2 credits
    standard : 10, // Standard plan : 10 credits per month
    premium : 24, // Premium plan : 24 credits per month
}

// Each appointment costs 2 credits
const APPOINTMENT_CREDIT_COST = 2;

export async function checkAndAllocateCredits(user) {
    try {
        if (!user){
            return null;
        }

        // Only allocate credits for PATIENTS
        if (user.role !== "PATIENT"){
            return user;
        }

        const { has }  = await auth();

        const hasBasic = ({plan: "free_user"});
        const hasStandard = ({plan: "standard"});
        const hasPremium = ({plan: "premium"});

        let currentPlan = null;
        let creditsToAllocate = 0;

        if (hasPremium) {
            currentPlan = "premium";
            creditsToAllocate = PLAN_CREDITS.premium;
        } else if (hasStandard) {
            currentPlan = "standard";
            creditsToAllocate = PLAN_CREDITS.standard;
        } else if (hasBasic) {
            currentPlan = "basic";
            creditsToAllocate = PLAN_CREDITS.basic;
        }

        if (!currentPlan) {
            return user;
        }

        const currentMonth = format(new Date(), "YYYY-MM")

        if (user.transactions.length > 0){
            const latestTransaction = user.transactions[0];
            const transactionMonth = format(new Date(latestTransaction.createdAt) , "YYYY-MM");
        }
    } catch (error) {
        
    }
}