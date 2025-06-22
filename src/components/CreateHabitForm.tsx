import React, { useState, useCallback, useEffect } from 'react';
import { useCreateHabit } from '../api/habitsApi';

interface CreateHabitFormProps {
    onClose: () => void;
}

const CreateHabitForm: React.FC<CreateHabitFormProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const createHabitMutation = useCreateHabit();

    // Memoize the submit handler to prevent unnecessary re-renders
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors = validate(name, description);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createHabitMutation.mutateAsync({
                name: name.trim(),
                description: description.trim() || undefined,
            });

            // Reset form and close
            setName('');
            setDescription('');
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Failed to create habit:', error);
        }
    }, [name, description, createHabitMutation, onClose]);

    // Memoize the cancel handler
    const handleCancel = useCallback(() => {
        setName('');
        setDescription('');
        setErrors({});
        onClose();
    }, [onClose]);

    // Memoize the name change handler
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);

        // Only clear name error if the input becomes valid
        if (errors.name) {
            const trimmedName = newName.trim();
            if (trimmedName && trimmedName.length >= 3 && trimmedName.length <= 100) {
                setErrors(prev => ({ ...prev, name: undefined }));
            }
        }
    }, [errors.name]);

    // Memoize the description change handler
    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDescription = e.target.value;
        setDescription(newDescription);

        // Only clear description error if the input becomes valid
        if (errors.description && newDescription.trim().length <= 500) {
            setErrors(prev => ({ ...prev, description: undefined }));
        }
    }, [errors.description]);

    // Handle overlay click to close form
    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // Handle form click to prevent closing
    const handleFormClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    // Handle key press for Enter submission
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    }, [handleSubmit]);

    const validate = (name: string, description?: string) => {
        const newErrors: { name?: string; description?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Habit name is required';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Habit name must be at least 3 characters';
        } else if (name.trim().length > 100) {
            newErrors.name = 'Habit name must be less than 100 characters';
        }

        if (description && description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        return newErrors;
    };

    return (
        <div className="modal-overlay" data-testid="form-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Habit</h2>
                    <button
                        className="close-btn"
                        onClick={handleCancel}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-habit-form" data-testid="create-habit-form" onClick={handleFormClick}>
                    <div className="form-group">
                        <label htmlFor="habit-name">Habit Name *</label>
                        <input
                            id="habit-name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            onKeyDown={handleKeyPress}
                            placeholder="e.g., Exercise daily, Read 30 minutes"
                            className={errors.name ? 'error' : ''}
                            disabled={createHabitMutation.isPending}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="habit-description">Description (optional)</label>
                        <textarea
                            id="habit-description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Add more details about your habit..."
                            rows={3}
                            disabled={createHabitMutation.isPending}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-btn"
                            disabled={createHabitMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={createHabitMutation.isPending}
                        >
                            {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
                        </button>
                    </div>

                    {createHabitMutation.isError && (
                        <div className="error-message">
                            {createHabitMutation.error instanceof Error
                                ? createHabitMutation.error.message
                                : 'Failed to create habit. Please try again.'}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateHabitForm; 