import React from "react";
import { useForm } from "react-hook-form";
import { CreateTicketCategoryRequest } from "../types/ticket-category.types";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Ticket,
  DollarSign,
  Layers,
  Calendar,
  AlignLeft,
  Loader2,
  Plus,
} from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketCategoryRequest) => void;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateTicketCategoryRequest>();

  // Validation logic for timeline synchronization
  const salesStartDate = watch("salesStartDate");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Define Access Tier"
      description="Establish ticket categories and inventory parameters for this deployment."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-2">
        {/* Tier Identity */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
            <Ticket className="w-3 h-3 text-[#FF3333]" /> Category Designation
          </label>
          <Input
            placeholder="e.g. VIP CLEARANCE"
            error={errors.name?.message}
            className="h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
            {...register("name", { required: "Designation required" })}
          />
        </div>

        {/* Pricing and Volume Metrics */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-[#FF3333]" /> Unit Valuation
              ($)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              className="h-11 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
              {...register("price", {
                required: "Valuation required",
                min: { value: 0, message: "Invalid valuation" },
              })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Layers className="w-3 h-3 text-[#FF3333]" /> Total Inventory
            </label>
            <Input
              type="number"
              placeholder="100"
              error={errors.quantityTotal?.message}
              className="h-11 bg-white/[0.03] border-white/10 text-white text-xs font-bold"
              {...register("quantityTotal", {
                required: "Quantity required",
                min: { value: 1, message: "Min 1 unit" },
              })}
            />
          </div>
        </div>

        {/* Sales Window Timeline */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#FF3333]" /> Window Open
            </label>
            <Input
              type="datetime-local"
              error={errors.salesStartDate?.message}
              className="h-11 bg-white/[0.03] border-white/10 text-white text-[10px]"
              {...register("salesStartDate", { required: "Opening required" })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-white/20" /> Window Close
            </label>
            <Input
              type="datetime-local"
              error={errors.salesEndDate?.message}
              className="h-11 bg-white/[0.03] border-white/10 text-white text-[10px]"
              {...register("salesEndDate", {
                required: "Closing required",
                validate: (value) =>
                  !salesStartDate ||
                  value > salesStartDate ||
                  "Timeline violation",
              })}
            />
          </div>
        </div>

        {/* Descriptive Narrative */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
            <AlignLeft className="w-3 h-3 text-[#FF3333]" /> Tier Inclusions
          </label>
          <textarea
            className="w-full h-24 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-xs leading-relaxed font-light italic focus:outline-none focus:ring-1 focus:ring-[#FF3333]/50 transition-all placeholder:text-white/10"
            placeholder="Specify access privileges and tier benefits..."
            {...register("description")}
          />
        </div>

        {/* Action Terminal */}
        <div className="flex justify-end items-center gap-6 pt-4 border-t border-white/5 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
          >
            Abort
          </button>
          <Button
            variant="premium"
            type="submit"
            disabled={isLoading}
            className="h-11 px-10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#FF3333]/10 border-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Commit Tier
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
