import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api/userApi';

function UserCard({ user, currentPage }) {
  const { id, email, first_name, last_name, avatar } = user;
  const queryClient = useQueryClient();

  const [isDeletingSelf, setIsDeletingSelf] = useState(false);
  const [deleteErrorSelf, setDeleteErrorSelf] = useState(null);

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: () => {
      setIsDeletingSelf(true);
      setDeleteErrorSelf(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', currentPage] });
    },
    onError: (error) => {
      console.error(`Failed to delete user ${id}:`, error);
      setDeleteErrorSelf(error.message || `Error deleting ${first_name}.`);
    },
    onSettled: () => {
      setIsDeletingSelf(false);
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${first_name} ${last_name}?`)) {
      deleteUserMutation.mutate(id);
    }
  };

  const isLoadingMutation = deleteUserMutation.isLoading || isDeletingSelf;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105 flex flex-col items-center">
      <img
        src={avatar}
        alt={`${first_name} ${last_name}`}
        className="w-24 h-24 rounded-full mb-4 border-4 border-gray-200 object-cover"
      />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {first_name} {last_name}
        </h3>
        <p className="text-sm text-gray-600 break-all">{email}</p>
      </div>
      {deleteErrorSelf && (
        <p className="text-xs text-red-500 mt-2 text-center">{deleteErrorSelf}</p>
      )}
      <button
        onClick={handleDelete}
        disabled={isLoadingMutation}
        className={`mt-6 w-full px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${isLoadingMutation
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                    }`}
      >
        {isLoadingMutation ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

export default UserCard;