
//------------------------------------------------
// https://crud-backend-1-7hq3.onrender.com


import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "react-datepicker/dist/react-datepicker.css";

function Form() {
  const [birthday, setBirthday] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    image: "",
  });

  const [userList, setUserList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    phoneNumber: false,
    birthday: false,
    gender: false,
    image: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://crud-backend-1-7hq3.onrender.com/api/user/getUsers");
      if (response.ok) {
        const data = await response.json();
        setUserList(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("An error occurred while fetching user data", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `https://crud-backend-1-7hq3.onrender.com/api/user/deleteUser/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("User deleted successfully");
        fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("An error occurred while deleting user", error);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUserId(user._id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      phoneNumber: user.phoneNumber,
      birthday: user.birthday ? new Date(user.birthday) : null,
      gender: user.gender,
      image: user.image,
    });
    setBirthday(user.birthday ? new Date(user.birthday) : null);
    setShowForm(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No image selected");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!validateForm()) {
      console.error("Form validation failed");
      return;
    }

    try {
      let apiUrl = "https://crud-backend-1-7hq3.onrender.com/api/user/register";

      if (selectedUserId) {
        apiUrl = `https://crud-backend-1-7hq3.onrender.com/api/user/updateUser/${encodeURIComponent(
          selectedUserId
        )}`;
      }

      const response = await fetch(apiUrl, {
        method: selectedUserId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          birthday: birthday ? birthday.toISOString().split("T")[0] : null,
        }),
      });

      if (response.ok) {
        console.log(
          `${selectedUserId ? "Update" : "Form submission"} successful`
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
          birthday: null,
          gender: "",
          image: "",
        });
        setBirthday(null);
        setSelectedUserId(null);

        document.getElementById("imageInput").value = "";
        fetchUsers();

        setShowForm(false);
      } else {
        console.error(
          `${selectedUserId ? "Update" : "Form submission"} failed`
        );
      }
    } catch (error) {
      console.error(
        `An error occurred while ${
          selectedUserId ? "updating" : "submitting"
        } the form`,
        error
      );
    }
  };

  const handleChange = (name, value) => {
    if (name === "birthday") {
      let formattedBirthday = "";

      if (value instanceof Date && !isNaN(value)) {
        setBirthday(value);
        const year = value.getFullYear();
        const month = (value.getMonth() + 1).toString().padStart(2, "0");
        const day = value.getDate().toString().padStart(2, "0");
        formattedBirthday = `${year}-${month}-${day}`;
      } else if (typeof value === "string") {
        setBirthday(new Date(value));
        formattedBirthday = value.split("T")[0]; 
      } else {
        console.error("Invalid date value");
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedBirthday,
      }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value === "" || value === null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      firstName: formData.firstName === "",
      lastName: formData.lastName === "",
      email: formData.email === "",
      // password: formData.password === "",
      phoneNumber: formData.phoneNumber === "",
      birthday: formData.birthday === "" || formData.birthday === null,
      gender: formData.gender === "",
      image: formData.image === "",
    };

    setFormErrors(errors);

    // Check if there are any errors
    return !Object.values(errors).some((error) => error);
  };

  const handleAddUserClick = () => {
    setSelectedUserId(null);
    setShowForm(!showForm);
  };

  return (
    <>
      <h1 className="mt-3 text-center text-success">CRUD Operation</h1>
      <div className="container mt-3">
        <div className="row mt-3">
          <div className="col-md-12">
            <button className="btn btn-primary" onClick={handleAddUserClick}>
              {showForm ? "Hide Form" : "Add User"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="row mt-3">
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.firstName ? "is-invalid" : ""
                        }`}
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                      {formErrors.firstName && (
                        <div className="invalid-feedback">
                          Please enter your first name.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.lastName ? "is-invalid" : ""
                        }`}
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                      {formErrors.lastName && (
                        <div className="invalid-feedback">
                          Please enter your last name.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">
                          Please enter your email.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.phoneNumber ? "is-invalid" : ""
                        }`}
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                      {formErrors.phoneNumber && (
                        <div className="invalid-feedback">
                          Please enter your phone number.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="birthday" className="form-label">
                        Birthday
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="date"
                          className={`form-control ${
                            formErrors.birthday ? "is-invalid" : ""
                          }`}
                          id="birthday"
                          name="birthday"
                          value={
                            birthday instanceof Date
                              ? birthday.toISOString().split("T")[0]
                              : birthday
                          }
                          onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                          }
                        />
                        {formErrors.birthday && (
                          <div className="invalid-feedback">
                            Please enter your birthday.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group  ">
                      <label>Gender</label>
                      <div className="d-flex">
                        <div className="me-4">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                          Male
                        </div>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={(e) =>
                            handleChange(e.target.name, e.target.value)
                          }
                        />
                        Female
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        className={`form-control ${
                          formErrors.password ? "is-invalid" : ""
                        }`}
                        name="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                      {formErrors.password && (
                        <div className="invalid-feedback">
                          Please enter your password.
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}


                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Upload Image</label>
                      <input
                        type="file"
                        className={`form-control ${
                          formErrors.image ? "is-invalid" : ""
                        }`}
                        id="imageInput"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {formErrors.image && (
                        <div className="invalid-feedback">
                          Please upload an image.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-primary">
                      {selectedUserId ? "Update Data" : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row mt-3">
          <div className="col-md-12">
            <h2>User List</h2>
            <div  className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Birthday</th>
                  <th>Gender</th>
                  <th>image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.birthday}</td>
                    <td>{user.gender}</td>
                    <td>
                      <img
                        src={user.image}
                        alt="User"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-info mr-2 mb-3"
                        onClick={() => handleUpdate(user)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger mx-2 mb-3"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
