import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    const key = Object.keys(value)[0];
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    return setForm((prev) => ({ ...prev, ...value }));
  }

  /**
   * Validates the form.
   * @returns {boolean} true if the form is valid, false otherwise.
   */
  const validationForm = () => {
    const errors = {};
    // Check if each field is not empty
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.position.trim()) errors.position = "Position is required.";
    if (!form.level.trim()) errors.level = "Level is required.";
    // Set the form errors state
    setFormErrors(errors);
    // Return true if there are no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  // This function will handle the submission.
  /**
   * Handles the submission of the form.
   * @param {Event} e the form submission event
   */
  async function onSubmit(e) {
    e.preventDefault();

    // Check if the form is valid
    if (!validationForm()) return;

    // Create a copy of the form's state
    const person = { ...form };

    // Check for errors (again)
    const errors = validationForm();
    if (Object.keys(errors).length > 0) {
      // If there are errors, set the form errors state
      setFormErrors(errors);
      return;
    }
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        console.log("submitting form:", form);
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
        console.log("response:", response);
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        Create/Update Employee Record
      </h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div
                  className={`flex items-center rounded-md ring-1 ring-inset ${
                    formErrors.name ? "ring-2 ring-red-500" : "ring-slate-300"
                  } focus-within:ring-2 focus-within:ring-indigo-600 transition-all`}
                >
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="First Last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    className="w-full border-none bg-transparent px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                  />
                </div>

                {/* Validation Message */}
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <div
                  className={`flex items-center rounded-md ring-1 ring-inset ${
                    formErrors.position
                      ? "ring-2 ring-red-500"
                      : "ring-slate-300"
                  } focus-within:ring-2 focus-within:ring-indigo-600 transition-all`}
                >
                  <input
                    type="text"
                    name="position"
                    id="position"
                    placeholder="Developer, Designer, Manager ..."
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                    className="w-full border-none bg-transparent px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                  />
                </div>

                {/* Validation Message */}
                {formErrors.position && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.position}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 sm:max-w-md">
              <fieldset>
                <legend className="block text-sm font-medium text-slate-900 mb-2">
                  Position Level
                </legend>
                <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-4">
                  {["Intern", "Junior", "Senior"].map((level) => (
                    <label
                      key={level}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-all
            ${
              form.level === level
                ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                : "border-slate-300 text-slate-700 hover:border-slate-400"
            }`}
                    >
                      <input
                        type="radio"
                        name="positionLevel"
                        value={level}
                        checked={form.level === level}
                        onChange={(e) => updateForm({ level: e.target.value })}
                        className="accent-indigo-600"
                      />
                      {level}
                    </label>
                  ))}
                </div>
                {formErrors.level && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.level}
                  </p>
                )}
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
