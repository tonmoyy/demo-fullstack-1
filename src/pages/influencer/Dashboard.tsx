import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function InfluencerDashboard() {
    type Campaign = {
        id: string
        title: string
        budget: number
    }

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);


    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from("campaigns")
            .select("*")

        if (error) {
            console.log(error.message)
            return
        }

        setCampaigns(data ?? [])
    }

    useEffect(() => {
        const load = async () => {
            await fetchCampaigns()
        }

        load()
    }, [])



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Influencer Dashboard</h1>

            <div className="grid grid-cols-3 gap-4 mt-4">
                {campaigns?.map(c => (
                    <div key={c.id} className="p-4 border rounded">
                        <h2>{c.title}</h2>
                        <p>${c.budget}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}