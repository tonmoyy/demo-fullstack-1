import {useEffect, useState} from "react"
import {supabase} from "../../lib/supabase"

type Application = {
    id: string
    status: "pending" | "accepted" | "rejected"
    campaign_id: string
    influencer_id: string
    campaigns: {
        title: string
    }[]
}
type GroupedData = {
    campaignId: string
    campaignTitle: string
    applicants: Application[]
}

export default function BrandApplications() {
    const [grouped, setGrouped] = useState<GroupedData[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const load = async () => {
            setLoading(true)

            const {data, error} = await supabase
                .from("applications")
                .select(`
          id,
          status,
          campaign_id,
          influencer_id,
          campaigns ( title )
        `)

            if (error) {
                console.log(error)
                setLoading(false)
                return
            }
            const apps = data ?? []
            const groupedMap: Record<string, GroupedData> = {}
            apps.forEach((app) => {
                const campaignId = app.campaign_id
                const title = app.campaigns?.[0]?.title ?? "No title"
                if (!groupedMap[campaignId]) {
                    groupedMap[campaignId] = {
                        campaignId,
                        campaignTitle: title,
                        applicants: []
                    }
                }
                groupedMap[campaignId].applicants.push(app)

            })
            setGrouped(Object.values(groupedMap))
            setLoading(false)
            // console.log("RAW DATA:", data)
            // console.log("ERROR:", error)

        }
        void load()
    }, [])

    // 🔄 Update status
    const updateStatus = async (
        id: string,
        newStatus: "accepted" | "rejected"
    ) => {
        const {error} = await supabase
            .from("applications")
            .update({status: newStatus})
            .eq("id", id)

        if (error) {
            console.log(error.message)
            return
        }

        // update UI instantly
        setGrouped(prev =>
            prev.map(group => ({
                    ...group,
                    applicants: group.applicants.map(app =>
                        app.id === id
                            ? {...app, status: newStatus}
                            : app
                    )
                })
            )
        )
    }


    if (loading) return <p className="p-6">Loading...</p>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Campaign Applicants
            </h1>

            {grouped.map(group => (
                <div key={group.campaignId} className="mb-6">

                    {/* 🏷 Campaign Title */}
                    <h2 className="text-xl font-bold mb-3">
                        {group.campaignTitle}
                    </h2>

                    <div className="space-y-3">
                        {group.applicants.map(app => (
                            <div
                                key={app.id}
                                className="border p-4 rounded"
                            >
                                <p>
                                    Influencer: {app.influencer_id}
                                </p>

                                <p>
                                    Status: {app.status}
                                </p>

                                {app.status === "pending" && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                updateStatus(app.id, "accepted")
                                            }
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateStatus(app.id, "rejected")
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
    )
}

