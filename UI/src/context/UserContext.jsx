import { createContext, useState, useEffect } from "react";
import { getDataByParams } from "../utils/service";
import { jwtDecode } from "jwt-decode";
import { axiosCli } from "../interceptor/axios";

// Tạo Context
export const UserContext = createContext();

// Tạo Provider
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  var token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      try {
        var tokenDecode = jwtDecode(token);
        setIsTokenValid(true);
        // Hàm lấy thông tin user từ server
        const getAccountInfo = async () => {
          await axiosCli()
            .get(`account/user-info/${tokenDecode._id}`)
            .then((res) => {
              if (!res.data.avatar) {
                res.data.avatar =
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg";
              }
              setUserData(res.data);
            })
            .catch((err) => {
              console.error("Error fetching student data", err);
            });
        };
        getAccountInfo();
      } catch (error) {
        console.error("Invalid token", error);
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }
  }, [token]);

  const updateUserData = (newData) => {
    setUserData(newData);
  };
  return (
    <UserContext.Provider value={{ userData, updateUserData, isTokenValid }}>
      {children}
    </UserContext.Provider>
  );
};
