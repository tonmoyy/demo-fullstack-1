import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

type Application = {
    id: string
    status: "pending" | "accepted" | "rejected"
    campaign_id: string
    influencer_id: string
    campaigns: {
        title: string
    }[]
}

export default function BrandApplications() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const[error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
          try {
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
                  throw error
              } else {
                  setApplications(data ?? [])
              }
          }
          catch(err:any){
              console.error(err)
              setError(err.message)
          }
          finally {

              setLoading(false)
          }
        }

        void load()
    }, [])

    // 🔄 Update status
    const updateStatus = async (
        id: string,
        newStatus: "accepted" | "rejected"
    ) => {
        try {
            const {error} = await supabase
                .from("applications")
                .update({status: newStatus})
                .eq("id", id)

            if (error) {
                console.log(error.message)
                return
            }

            // update UI instantly
            setApplications(prev =>
                prev.map(app =>
                    app.id === id
                        ? {...app, status: newStatus}
                        : app
                )
            )
        }
        catch (err: any) {
            console.log(err.message)
        }
    }

    if (loading) return <p className="p-6">Loading...</p>
    if (error) return <p className="p-6 text-red-500">{error}</p>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Brand Applications
            </h1>

            <div className="space-y-4">
                {applications.map(app => (
                    <div
                        key={app.id}
                        className="border p-4 rounded shadow"
                    >
                        <h2 className="font-bold text-lg">
                            {app.campaigns?.[0]?.title??"No Title"}
                        </h2>

                        <p>Influencer: {app.influencer_id}</p>
                        <p>Status: {app.status}</p>

                        {app.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() =>
                                        updateStatus(app.id, "accepted")
                                    }
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(app.id, "rejected")
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}