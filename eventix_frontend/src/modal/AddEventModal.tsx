import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { CreateEventRequest, EventResponse } from "../types/event.types";
import eventService from "../service/eventService";
import { useAppSelector } from "../store";
import {
  Type,
  MapPin,
  Clock,
  Calendar,
  Globe,
  Eye,
  Image as ImageIcon,
  AlignLeft,
  Loader2,
  Plus,
  Sparkles,
  AlertCircle
} from "lucide-react";

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

const AddEventModal: React.FC<AddEventModalProps> = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState<CreateEventRequest>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const orgId = user?.currentOrganizationId || 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setError("Incomplete manifest. Primary data nodes required.");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError("Timeline violation: Commencement must precede conclusion.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const createdEvent = await onCreate(form);

      if (imageFile && createdEvent?.id) {
        await eventService.uploadImage(orgId, createdEvent.id, imageFile);
      }

      setForm(initialState);
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err) {
      setError("Synchronization failed. Check uplink.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Initialize Manifest"
      description="Deploy a new event asset to the global registry."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {/* Image Dropzone Asset */}
        <div className="space-y-2">
          <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
            <ImageIcon className="w-3 h-3 text-[#FF3333]" /> Visual Identity (Banner)
          </label>
          <div className="relative group cursor-pointer">
            <div className={`w-full h-32 rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden bg-white/[0.02] ${imagePreview ? 'border-[#FF3333]/50' : 'border-white/10 hover:border-[#FF3333]/30'}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all" />
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Plus className="w-6 h-6 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Upload Asset</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Identity */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Type className="w-3 h-3 text-[#FF3333]" /> Asset Designation
            </label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="EVENT TITLE"
              className="h-11 bg-white/[0.03] border-white/10 text-white text-xs font-bold tracking-widest"
              required
            />
          </div>

          {/* Location & Timezone */}
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#FF3333]" /> Deployment Coordinate
            </label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="VENUE / CITY"
              className="h-11 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#FF3333]" /> Temporal Zone
            </label>
            <Input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              placeholder="e.g. UTC"
              className="h-11 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
            />
          </div>

          {/* Timeline */}
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#FF3333]" /> Commencement
            </label>
            <Input
              name="startDate"
              type="datetime-local"
              value={form.startDate}
              onChange={handleChange}
              className="h-11 bg-white/[0.03] border-white/10 text-white text-[10px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#FF3333]" /> Conclusion
            </label>
            <Input
              name="endDate"
              type="datetime-local"
              value={form.endDate}
              onChange={handleChange}
              className="h-11 bg-white/[0.03] border-white/10 text-white text-[10px]"
              required
            />
          </div>

          {/* Protocol Selection */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Eye className="w-3 h-3 text-[#FF3333]" /> Visibility Protocol
            </label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-[10px] font-black tracking-[0.2em] text-white focus:ring-1 focus:ring-[#FF3333]/50 appearance-none cursor-pointer outline-none"
            >
              <option value="PUBLIC" className="bg-[#0A0000]">PUBLIC (OPEN NODE)</option>
              <option value="PRIVATE" className="bg-[#0A0000]">PRIVATE (ENCRYPTED)</option>
            </select>
          </div>

          {/* Descriptive Narrative */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <AlignLeft className="w-3 h-3 text-[#FF3333]" /> Mission Narrative
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="DETAILED DESCRIPTION..."
              className="w-full h-24 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-xs leading-relaxed font-light italic focus:outline-none focus:ring-1 focus:ring-[#FF3333]/50 transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-6 pt-6 border-t border-white/5 mt-4">
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
            disabled={isSubmitting}
            className="h-11 px-10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#FF3333]/10 border-0"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Initialize Asset
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventModal;