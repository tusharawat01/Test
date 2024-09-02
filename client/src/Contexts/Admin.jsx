"use client"

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { requestUrl } from "../utils/constants";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/", sameSite: 'lax' })

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [allNewUsers, setAllNewUsers] = useState([]);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    haveDrones: false,
    notHavingDrones: false,
    haveWorkExp: false,
    haveLicense: false,
  });

  async function handleLogout() {
    if (!confirm("Are You Sure to Log out?"))
      return;
    else {
      setLoading(true);
      try {
        cookies.remove('adauth');
        setAdmin(null);

        router.push("/admin/login");
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  }
  

  async function fetchUsers() {
const adauth = cookies.get("adauth") 

    if(!adauth)
        router.push("/admin/login");

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 15,
        ...filters,
      });
    
      const response = await axios.get(`${requestUrl}/user/all?${params.toString()}`, {
        headers: {
          'adauth': adauth
        },
        withCredentials: true
      });
      setRes(response.data);
      setAllUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function fetchNewUsers() {
const adauth = cookies.get("adauth") 

    if(!adauth)
        router.push("/admin/login");
    try {
      setLoading(true);
      const response = await axios.get(`${requestUrl}/user/all/new`, {
        headers: {
          'adauth': adauth
        },
        withCredentials: true
      });
      setAllNewUsers(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
  useEffect(() => {
  fetchUsers();
    fetchNewUsers();

}, [page, filters]);

  useEffect(() => {
    async function fetchData() {
const adauth = cookies.get("adauth") 

      if(!adauth)
        router.push("/admin/login");
      setLoading(true);
      try {
        const adminResponse = await axios.get(`${requestUrl}/admin/detail`, {
          headers: {
            'adauth': adauth
          },
          withCredentials: true
        });

        setAdmin({
          email: adminResponse.data.admin.email
        });

        setLoading(false);
      } catch (error) {
        router.push("/admin/login");
        setLoading(false);
      }
    }

    fetchData();
  

  }, []);

  return (
    <DataContext.Provider
      value={{
        admin,
        allUsers,
        res,
        loading,
        handleLogout,
        fetchUsers,
        setPage,
        setFilters,
        allNewUsers,
        filters
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
