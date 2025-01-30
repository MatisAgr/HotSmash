import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileUser } from '../../redux/slices/authSlice';
// import { Modal, Button, Label, TextInput, Textarea, Select } from 'flowbite-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profileUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><div className="bg-white shadow-md rounded p-4"><h1 className="text-3xl font-bold text-center text-red-500">{error}</h1></div></div>;
  }

  return (
  <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-white">Profile Page</h1>
        {user && (
          <div className="bg-white shadow-md rounded p-4">
            {/* {editMode ? ( */}
              <form 
              // onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    // value={formData.username}
                    // onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    // value={formData.email}
                    // onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    // value={formData.password}
                    // onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    // value={formData.confirmPassword}
                    // onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    // onClick={() => setEditMode(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            {/* ) : ( */}
              <>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p> */}
                <button
                  // onClick={() => setEditMode(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                >
                  Edit Profile
                </button>
                <button
                  // onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-5 rounded focus:outline-none focus:shadow-outline mt-4"
                >
                  Delete Account
                </button>
              </>
            {/* )} */}
          </div>
        )}
  
      </div>
    );
};

export default ProfilePage;