import { NavLink } from "react-router-dom";
import { FaUser, FaUserPlus } from "react-icons/fa";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img
            alt="MongoDB logo"
            className="h-10 inline"
            src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"
          ></img>
        </NavLink>

        <NavLink
          className="group inline-flex items-center gap-1 justify-center whitespace-nowrap text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input border-indigo-600 bg-indigo-600 hover:bg-indigo-700 hover:text-accent-foreground h-9 rounded-md px-3"
          color="indigo"
          to="/create"
        >
          <FaUserPlus className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
          Create Employee
        </NavLink>
      </nav>
    </div>
  );
}
