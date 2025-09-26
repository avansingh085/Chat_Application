import { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient.js";
export default function GroupAutoDelete({ conversationId }) {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data,setData]=useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/group-auto-delete/${conversationId}`);
        if (res.data?.date) {
            setData(res.data)
          setDate(res.data.date.split("T")[0]); 
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load auto delete settings"+err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

  const handleChangeDate = async () => {
    if (!date) return;
    setSaving(true);
    try {
      await apiClient.put(`/group-auto-delete/${data._id}`, {
        conversationId,
        date,
      });
      alert("Auto delete date updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update date");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <span className="animate-spin h-6 w-6 inline-block border-2 border-blue-500 border-t-transparent rounded-full"></span>
        <p className="text-sm mt-2">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-2xl shadow-md bg-white max-w-md">
      <h2 className="text-lg font-semibold mb-3">
        Auto Delete Group on Day
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={handleChangeDate}
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          )}
          Change Date
        </button>
      </div>
    </div>
  );
}
