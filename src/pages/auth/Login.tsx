import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.log(error.message)
        } else {
            console.log("Logged in", data)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="p-6 bg-white shadow rounded w-80">
                <h1 className="text-xl mb-4">Login</h1>
                <input className="input" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
                <input className="input mt-2" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
                <button onClick={handleLogin} className="btn mt-4">Login</button>
            </div>
        </div>
    )
}