import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { EventResponse, UpdateEventRequest } from "../types/event.types";

interface EditEventModalProps {
  open: boolean;
  event: EventResponse | null;
  onClose: () => void;
  onUpdate: (data: UpdateEventRequest) => Promise<void>;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  event,
  onClose,
  onUpdate,
}) => {
  const [form, setForm] = useState<UpdateEventRequest>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    timezone: "",
    visibility: "PUBLIC",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: event.startDate?.slice(0, 16) || "",
        endDate: event.endDate?.slice(0, 16) || "",
        timezone: event.timezone || "",
        visibility: (event.visibility as "PUBLIC" | "PRIVATE") || "PUBLIC",
      });
    }
  }, [event]);

  if (!open || !event) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate || !form.location) {
      setError("Please fill all required fields.");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError("Start date must be before end date.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onUpdate(form);
      onClose();
    } catch {
      setError("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-card rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded p-2"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border rounded p-2"
            required
          />
          <input
            name="startDate"
            type="datetime-local"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            name="endDate"
            type="datetime-local"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            placeholder="Timezone (e.g. UTC)"
            className="w-full border rounded p-2"
          />
          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
