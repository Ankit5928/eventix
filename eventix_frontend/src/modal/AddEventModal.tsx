import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { CreateEventRequest, EventResponse } from "../types/event.types";
import eventService from "../service/eventService";
import { useAppSelector } from "../store";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (event: CreateEventRequest) => Promise<EventResponse | undefined>;
}

const initialState: CreateEventRequest = {
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  timezone: "",
  visibility: "PUBLIC",
};

const AddEventModal: React.FC<AddEventModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState<CreateEventRequest>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const orgId = user?.currentOrganizationId || 1;

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    const createdEvent = await onCreate(form);

    // Upload image if selected
    if (imageFile && createdEvent && createdEvent.id) {
      setUploading(true);
      try {
        await eventService.uploadImage(orgId, createdEvent.id, imageFile);
      } catch {
        // Image upload failed but event was created
      }
      setUploading(false);
    }

    setForm(initialState);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-card rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Event Banner
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title *"
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded p-2"
            rows={3}
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location *"
            className="w-full border rounded p-2"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Start *</label>
              <input
                name="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">End *</label>
              <input
                name="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>
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
            <Button type="submit" variant="default" disabled={uploading}>
              {uploading ? "Uploading..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
