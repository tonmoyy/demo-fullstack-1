import { supabase } from "./supabase"

export const getUserRole = async () => {
    const { data: userData, error: userError } =
        await supabase.auth.getUser()

    if (userError || !userData?.user) {
        console.log("User error:", userError)
        return null
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single()

    if (error) {
        console.log("Role error:", error.message)
        return null
    }

    return data?.role ?? null
}