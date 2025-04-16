import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Font Awesome icons

const Button = ({ children, className, ...props }) => (
  <button
    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
    {...props}
  >
    {children}
  </button>
);

const HomePage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Home Page</h1>
        <Link to="/create">
          <Button>Create Employee</Button>
        </Link>
        <Link to="/recordlist">
          <Button className="flex items-center">
            <FaEdit className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
            <span className="ml-2">Record List</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
