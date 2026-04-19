import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("influencer")

    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (data?.user) {
            await supabase.from("profiles").insert({
                id: data.user.id,
                role
            })
        }

        if (error) alert(error.message)
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="p-6 bg-white shadow rounded w-80">
                <h1 className="text-xl mb-4">Signup</h1>

                <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

                <select onChange={e=>setRole(e.target.value)}>
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                </select>

                <button onClick={handleSignup}>Signup</button>
            </div>
        </div>
    )
}