import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateTicketCategoryRequest } from '../types/ticket-category.types';
import Button from '../components/commons/Button';
import Input from '../components/commons/Input';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketCategoryRequest) => void;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateTicketCategoryRequest>();

  // Validation: Sales end must be after sales start
  const salesStartDate = watch('salesStartDate');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Add Ticket Category</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. VIP Early Bird"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price cannot be negative' }
              })}
            />
            <Input
              label="Total Quantity"
              type="number"
              placeholder="100"
              error={errors.quantityTotal?.message}
              {...register('quantityTotal', { 
                required: 'Quantity is required',
                min: { value: 1, message: 'Must be at least 1' }
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sales Start"
              type="datetime-local"
              error={errors.salesStartDate?.message}
              {...register('salesStartDate', { required: 'Start date is required' })}
            />
            <Input
              label="Sales End"
              type="datetime-local"
              error={errors.salesEndDate?.message}
              {...register('salesEndDate', { 
                required: 'End date is required',
                validate: value => !salesStartDate || value > salesStartDate || 'End date must be after start date'
              })}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="What does this ticket include?"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;