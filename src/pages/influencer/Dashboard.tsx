import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function InfluencerDashboard() {
    type Campaign = {
        id: string
        title: string
        budget: number
    }

    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const[appliedIds,setAppliedIds]=useState<string[]>([])
    const [userId,setUserId]=useState<string | null>(null)
    const [loading,setLoading] =useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        const init=async ()=>{
            try{
                setLoading(true)

                // 1. Get user
                const {data:userData}=await supabase.auth.getUser()
                const uid=userData.user?.id??null

                if(!uid) throw new Error("User not logged in")

                // 2. Fetch campaigns
                const {data:campaignsData}=await supabase
                    .from ("campaigns")
                    .select("*")

                // 3. Fetch applications

                const{data:appData}=await supabase
                    .from("applications")
                    .select("campaignId")
                    .eq("influencer_id",uid)
                // ✅ Prepare everything FIRST

                const campaigns = campaignsData??[]
                const appliedIds=appData?.map(a=>a.campaignId)??[]
                // ✅ Then update state ONCE (grouped logically)

                setUserId(uid)
                setCampaigns(campaigns)
                setAppliedIds(appliedIds)
            }
            catch(err:any){
                console.error(err)
                setError(err.message)
            }
            finally{
                setLoading(false)
            }
        }
        void init()
    }, []);


// 🚀 Apply function
    const applyToCampaign=async (campaignId:string) => {
        if(!userId) return
        try {
            const { error } = await supabase
                .from("applications")
                .insert({
                    campaign_id: campaignId,
                    influencer_id: userId,
                })
            if (error) throw error
            // update UI instantly
            setAppliedIds(prev => [...prev, campaignId]) }
        catch (err: any) {
            console.log(err.message)

            // duplicate error (safe fallback)
            if (err.message.includes("duplicate")) {
                alert("Already applied")
            }
        }
    }
    // 🧪 UI states
    if (loading) return <p className="p-6">Loading...</p>
    if (error) return <p className="p-6 text-red-500">{error}</p>
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Influencer Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaigns.map((c) => {
                    const isApplied = appliedIds.includes(c.id)

                    return (
                        <div
                            key={c.id}
                            className="border rounded p-4 shadow-sm"
                        >
                            <h2 className="font-bold text-lg">
                                {c.title}
                            </h2>

                            <p className="mb-3">
                                Budget: ${c.budget}
                            </p>

                            <button
                                disabled={isApplied}
                                onClick={() => applyToCampaign(c.id)}
                                className={`w-full py-2 rounded text-white ${
                                    isApplied
                                        ? "bg-gray-400"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                {isApplied ? "Applied" : "Apply"}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )


}

