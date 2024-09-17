import React from 'react'

const UserProfileCard: React.FC<any> = ({ userProfile }) => {
    return (
        <div className="card flex flex-row  items-center justify-center px-10  max-sm:p-4 bg-white text-gray-600 shadow-md">
            <figure className="w-32 h-32 rounded-full overflow-hidden">
                <img
                    src={userProfile.image}
                    alt="Profile"
                    className="object-cover w-full h-full"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title mb-0 mt-0">{userProfile.name}</h2>
                <p className="mb-0 mt-0">{userProfile.email}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-sm  text-white bg-red-500 hover:bg-red-600 border-none    hover:scale-110 transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserProfileCard