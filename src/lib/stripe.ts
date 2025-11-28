import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true,
})

export const getStripeCustomer = async (userId: string, email: string) => {
    // This function would normally interact with DB to find/create customer
    // For now, we'll just return a mock or implement later
    return null
}
