"use client";

import { useEffect, useState } from "react";

export default function ProofPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          "https://crwdzwspkayvssimejwr.supabase.co/rest/v1/prediction_logs?order=timestamp.desc",
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch prediction logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-lime-400 mb-4">
        🧠 InfinityXOS — Proof of Prediction
      </h1>
      <p className="mb-6 text-lg text-blue-300">
        Every prediction, every log, timestamped and tracked.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-900 border-lime-400 border-l-4 p-4 rounded-xl"
            >
              <div className="text-blue-200 text-sm">
                <strong>Time:</strong>{" "}
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <div className="text-lg font-semibold text-lime-300">
                {log.asset}: {log.prediction}
              </div>
              <div className="text-sm text-white">
                Confidence:{" "}
                <span className="text-green-400">
                  {(log.confidence * 100).toFixed(2)}%
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Model: {log.model_version || "Unknown"}
              </div>
              {log.accuracy_score !== null && (
                <div className="text-sm text-yellow-400">
                  Accuracy: {(log.accuracy_score * 100).toFixed(2)}%
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No predictions found.</p>
      )}
    </div>
  );
}
