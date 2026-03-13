import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { EventResponse, UpdateEventRequest } from "../types/event.types";
import {
  Calendar,
  MapPin,
  Type,
  AlignLeft,
  Globe,
  Eye,
  Loader2,
  AlertCircle,
  Save,
  Clock
} from "lucide-react";

// The missing interface that was causing the error
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
  onUpdate
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onUpdate(form);
      onClose();
    } catch {
      setError("Synchronization failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit Manifest"
      description="Update operational parameters."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="h-3 w-3" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Type className="w-3 h-3 text-[#FF3333]" /> Identity
            </label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="h-10 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#FF3333]" /> Location
            </label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="h-10 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#FF3333]" /> Timezone
            </label>
            <Input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="h-10 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#FF3333]" /> Commencement
            </label>
            <Input
              name="startDate"
              type="datetime-local"
              value={form.startDate}
              onChange={handleChange}
              className="h-10 bg-white/[0.03] border-white/10 text-white text-[10px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#FF3333]" /> Conclusion
            </label>
            <Input
              name="endDate"
              type="datetime-local"
              value={form.endDate}
              onChange={handleChange}
              className="h-10 bg-white/[0.03] border-white/10 text-white text-[10px]"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <AlignLeft className="w-3 h-3 text-[#FF3333]" /> Narrative
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white text-xs italic font-light focus:outline-none focus:ring-1 focus:ring-[#FF3333]/50 shadow-inner"
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-6 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
          >
            Abort
          </button>
          <Button
            type="submit"
            variant="premium"
            disabled={loading}
            className="h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] border-0 shadow-lg shadow-[#FF3333]/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Commit Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEventModal;