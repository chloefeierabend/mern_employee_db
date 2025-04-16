import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Font Awesome icons

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="group inline-flex items-center gap-1 justify-center whitespace-nowrap text-sm font-regular text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input border-blue-500 bg-blue-500 hover:bg-blue-700 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          <FaEdit className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
          Edit
        </Link>
        <button
          className="group inline-flex items-center gap-1 justify-center whitespace-nowrap text-sm font-regular text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input border-red-600 bg-red-600 hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          <FaTrash className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState(""); // filter by level
  const [sortOrder, setSortOrder] = useState("asc"); // sort order by asc or desc

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  /**
   * Returns a filtered and mapped list of records based on the searchTerm.
   *
   * @returns {JSX.Element[]} A list of Record components.
   */
  function recordList() {
    // Filter the records array to include only records that match the searchTerm
    return (
      records
        .filter((record) => {
          // Combine the record's name, position, and level into a single string
          const recordString = `${record.name} ${record.position} ${record.level}`;
          const recordNameString = `${record.name}`;
          const searchMatch = recordString
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const levelFilterMatch =
            levelFilter === "" || record.level === levelFilter;

          // Check if the record's name matches the search term
          const searchNameMatch = recordNameString
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          if (!levelFilterMatch) {
            return false;
          }

          return searchMatch;
        })

        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (sortOrder === "asc") return nameA.localeCompare(nameB);
          else return nameB.localeCompare(nameA);
        })

        // Map the filtered records to a list of Record components
        .map((record) => (
          // Render a Record component for each record, passing the record data and a delete function as props
          <Record
            record={record} // Pass the entire record object as a prop
            deleteRecord={() => deleteRecord(record._id)} // Pass a delete function that takes the record's ID as an argument
            key={record._id} // Set the key prop to the record's ID for React's reconciliation algorithm
          />
        ))
    );
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3>Employee Records</h3>
      {/* This input field is used to filter the records by name. It is a controlled component,
          meaning that its value is being managed by the component's state. When the user types
          something in the input field, the onChange event handler is triggered, and the setSearchTerm
          function is called with the event target's value. This function updates the searchTerm state
          variable with the new value, which causes the component to re-render with the new value. */}
      <input
        type="text"
        placeholder="Search employees by name..."
        value={searchTerm} // controlled component, value is managed by component's state
        onChange={(e) => setSearchTerm(e.target.value)} // updates searchTerm state variable
        className="mb-4 p-2 border rounded w-full" // CSS classes for styling
      />
      {/* // This div contains a series of buttons that allow the user to filter the records by level.  */}

      {/* /// This div contains a series of buttons that allow the user to filter the records by level. ORIGINAL WORKS */}
      {/* <div className="flex gap-2 mb-4">
        <h4>Filter by level:</h4>
        <button onClick={() => setLevelFilter("")}>All</button>
        <button onClick={() => setLevelFilter("Intern")}>Intern</button>
        <button onClick={() => setLevelFilter("Junior")}>Junior</button>
        <button onClick={() => setLevelFilter("Senior")}>Senior</button>
      </div> */}

      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700">Filter by level:</h4>
        {["", "Intern", "Junior", "Senior"].map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200
        ${
          levelFilter === level
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
          >
            {level === "" ? "All" : level}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700">Sort by name:</h4>
        <button
          onClick={() => setSortOrder("asc")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
            sortOrder === "asc"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Ascending
        </button>
        <button
          onClick={() => setSortOrder("desc")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
            sortOrder === "desc"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Descending
        </button>
      </div>

      {/* /// This div contains a table that displays the filtered records. */}
      <div className="border rounded-lg overflow-hidden">
        {/* added table-fixed to fix layout issue */}
        <div className="relative w-full overflow-auto">
          <table className="table-fixed w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">{recordList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
