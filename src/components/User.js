import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { PrimaryContext } from "../context/PrimaryContext";
import "./User.css";

export default function User() {
  const { users, addUser, editManagementUserData } = useContext(PrimaryContext);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const [filters, setFilters] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [updatedUser, setUpdatedUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  // useEffect(() => {
  //   console.log(updatedUser);
  // }, [updatedUser]);
  const filteredUsers = users.filter((user) => {
    return (
      user.first_name
        .toLowerCase()
        .includes(filters.first_name.toLowerCase()) &&
      user.last_name.toLowerCase().includes(filters.last_name.toLowerCase()) &&
      user.phone.toString().includes(filters.phone.toString()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase())
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const phoneRegex = /^\d{8,}$/;
      if (!phoneRegex.test(newUser.phone)) {
        alert("Please enter a valid phone number with at least 8 digits.");
        return;
      }
      await addUser(newUser);
      setNewUser({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setUpdatedUser({
      first_name: "",
      last_name: "",
      phone: "",
    });
  };

  const handleEditSubmit = (e) => {
    const phoneRegex = /^\d{8,}$/;
    // if (!phoneRegex.test(updatedUser.phone)) {
    //   alert("Please enter a valid phone number with at least 8 digits.");
    //   return;
    // }
    if (updatedUser.phone && !phoneRegex.test(updatedUser.phone)) {
      alert(
        "Please enter a valid phone number with at least 8 digits, or leave it black if you aren't changing the number."
      );
      return;
    }
    editManagementUserData(e.id, updatedUser);
    setEditingId(null);
    setUpdatedUser({
      first_name: "",
      last_name: "",
      phone: "",
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="user-form">
        <div>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            id="first_name"
            value={newUser.first_name}
            onChange={(e) =>
              setNewUser({ ...newUser, first_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            id="last_name"
            value={newUser.last_name}
            onChange={(e) =>
              setNewUser({ ...newUser, last_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            id="phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            id="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="my-Button">
          Add User
        </Button>
      </form>
      <table className="my-table">
        <thead>
          <tr>
            <th>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={filters.first_name}
                  onChange={(e) =>
                    setFilters({ ...filters, first_name: e.target.value })
                  }
                />
              </form>
            </th>
            <th>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={filters.last_name}
                  onChange={(e) =>
                    setFilters({ ...filters, last_name: e.target.value })
                  }
                />
              </form>
            </th>
            <th>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Phone"
                  value={filters.phone}
                  onChange={(e) =>
                    setFilters({ ...filters, phone: e.target.value })
                  }
                />
              </form>
            </th>
            <th>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) =>
                    setFilters({ ...filters, email: e.target.value })
                  }
                />
              </form>
            </th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={updatedUser.first_name}
                    placeholder={user.first_name}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        first_name: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.first_name
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={updatedUser.last_name}
                    placeholder={user.last_name}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        last_name: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.last_name
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={updatedUser.phone}
                    placeholder={user.phone}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.phone
                )}
              </td>
              <td>{user.email}</td>
              <td>
                {editingId === user.id ? (
                  <>
                    <Button variant="danger" onClick={handleCancelClick}>
                      Cancel
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleEditSubmit(user)}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEditClick(user.id)}>Edit</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
