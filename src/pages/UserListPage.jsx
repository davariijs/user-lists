import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '../api/userApi';
import UserCard from '../components/UserCard';

function UserListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: () => fetchUsers(currentPage),
    keepPreviousData: true,
  });

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(1, prevPage - 1));
  };

  useEffect(() => {
    const hasMoreData = users && users.length > 0;
    if (hasMoreData) {
      queryClient.prefetchQuery({
        queryKey: ['users', currentPage + 1],
        queryFn: () => fetchUsers(currentPage + 1),
      });
    }
  }, [users, currentPage, queryClient]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error?.message || 'An error occurred while fetching users.'}</span>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['users', currentPage] })}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">User List</h1>
      {isFetching && <p className="text-center text-blue-500 mb-4">Updating...</p>}
      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map(user => (
            <UserCard key={user.id} user={user} currentPage={currentPage} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No users to display.</p>
      )}

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="self-center text-gray-700">Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={!users || users.length < 6}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserListPage;