/* File: Home.tsx */
"use client";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import "./styles.css"; // custom CSS tanpa bootstrap

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: undefined as string | undefined,
    name: "",
    no_rm: "",
    date_of_birth: "",
    phone_number: "",
    address: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadData = () => {
    api
      .get("/")
      .then((res: any) => {
        setUsers(res.data.results.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/${form.id}`, form);
        alert("Update successful!");
      } else {
        let newData = { ...form };
        delete newData.id;
        await api.post("/", newData);
        alert("Successfully added!");
      }

      loadData();

      setForm({
        id: "",
        name: "",
        no_rm: "",
        date_of_birth: "",
        phone_number: "",
        address: "",
      });
      setIsEdit(false);
      setShowForm(false);
    } catch (error) {
      console.log(error);
      alert("failed to save!");
    }
  };

  const handleEdit = (u: any) => {
    setForm({
      id: u.id,
      name: u.name,
      no_rm: u.no_rm,
      date_of_birth: u.date_of_birth,
      phone_number: u.phone_number,
      address: u.address,
    });

    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Confirm delete?")) return;

    try {
      await api.delete(`/${id}`);
      alert("Successfully deleted!");
      loadData();
    } catch (error) {
      alert("Delete failed!");
    }
  };

  return (
    <div className="page-container">
      <div className="header-row">
        <p className="title-text ">List Pasien</p>
        <button
          className="btn-warning-custom"
          onClick={() => {
            setShowForm(true);
            setIsEdit(false);
            setForm({
              id: "",
              name: "",
              no_rm: "",
              date_of_birth: "",
              phone_number: "",
              address: "",
            });
          }}
        >
          Add New Pasien
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="hidden" name="id" value={form.id} onChange={handleChange} />
              <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Input Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              </div>

              <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Input No Rm"
                name="no_rm"
                value={form.no_rm}
                onChange={handleChange}
              />
              </div>

              <div className="form-group">
              <input
                type="date"
                className="input-field"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
              />
              </div>
            </div>

            <div className="form-row">
              <input
                type="number"
                className="input-field"
                placeholder="Input Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Input Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />

              <button type="submit" className="btn-danger-custom">
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="table-custom">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>No Rm</th>
            <th>Date Of Birth</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center">Loading...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td className="text-center" colSpan={7}>No Data</td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={i} className="table-row-rounded">
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.no_rm}</td>
                <td>{u.date_of_birth}</td>
                <td>{u.phone_number}</td>
                <td>{u.address}</td>
                <td className="td-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleEdit(u)}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleDelete(u.id)}
                  >
                    🗑️
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}



