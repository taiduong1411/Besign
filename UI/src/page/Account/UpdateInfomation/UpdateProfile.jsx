import { Avatar, Progress } from "antd";
import Footer from "../../../component/Footer/Footer";
import Header from "../../../component/Header/Navbar";
import { useEffect, useState, useContext } from "react";
// import { postDataByParams } from "../../../utils/service";
import { useForm } from "react-hook-form";
import upload from "../../../utils/upload";
// import Popup from "../../../components/Popup/Popup";
import { UserContext } from "../../../context/UserContext";
// import Message from "../../../components/Popup/Message";
function UpdateProfile() {
  const { studentData, updateStudentData } = useContext(UserContext);
  const [avatarUrl, setAvatarUrl] = useState(null);
  // const [studentId, setStudentId] = useState("");
  useEffect(() => {
    if (studentData && studentData.img) {
      setAvatarUrl(studentData.img);
    }
    // setStudentId(studentData?.student_Id);
  }, [studentData]);
  // HANDLE AVATAR CHANGE
  const [file, setFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const handleCamera = () => {
    document.getElementById("fileInput").click();
  };
  const handleFileChange = (event) => {
    const fileName = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
    };
    if (fileName) {
      reader.readAsDataURL(fileName);
    }
    setFile(fileName);
  };
  // HANDLE AFTER SUBMIT FORM
  // const [signal, setSignal] = useState(false);
  // const [msg, setMsg] = useState({
  //   type: "",
  //   content: "",
  // });
  // const serverMessage = {
  //   msg,
  // };

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const onUpdateSubmit = async (data) => {
    setShowUploadProgress(!showUploadProgress);
    const cloud = await upload(file, "tdtu_clubs/avatar", setUploadProgress);
    let allData = {
      full_name: data["full_name"] ? data["full_name"] : studentData.full_name,
      phone: data["phone"] ? data["phone"] : studentData.phone,
      address: data["address"] ? data["address"] : studentData.address,
      img: cloud ? cloud.url : studentData.img,
      email: data["email"] ? data["email"] : studentData.email,
    };
    // console.log(allData);
    if (data["new_password"] != data["confirm_password"]) {
      setError("Xác nhận mật khẩu không trùng khớp");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (!data["old_password"] && !data["new_password"]) {
      allData = {
        ...allData,
      };
    } else if (!data["old_password"] || !data["new_password"]) {
      setError("Vui lòng điền đầy đủ thông tin");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else {
      allData = {
        ...allData,
        old_password: data["old_password"],
        new_password: data["new_password"],
      };
    }
    // await postDataByParams(
    //   `account/update-info/${studentData.student_Id}`,
    //   allData
    // ).then(async (res) => {
    //   setMsg({
    //     type: res.status == 200 ? "success" : "error",
    //     content: res.data.msg,
    //   });
    //   setShowUploadProgress(false);
    //   setSignal(true);
    //   updateStudentData(res.data.student);
    // });
  };
  if (!studentData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-svh">
      {/* <Message
        serverMessage={serverMessage}
        signal={signal}
        setSignal={setSignal}
      /> */}
      <div>
        <Header />
      </div>
      <div className="container m-auto">
        <div className="border min-h-svh mt-8 mb-8 rounded-xl">
          <form onSubmit={handleSubmit(onUpdateSubmit)}>
            <div className="pt-8 flex items-end w-fit m-auto">
              <Avatar
                size={150}
                src={avatarUrl}
                alt="img"
                className="object-cover"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=""
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                onClick={handleCamera}>
                <path d="M9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7L9 3ZM12 19C15.3137 19 18 16.3137 18 13C18 9.68629 15.3137 7 12 7C8.68629 7 6 9.68629 6 13C6 16.3137 8.68629 19 12 19ZM12 17C9.79086 17 8 15.2091 8 13C8 10.7909 9.79086 9 12 9C14.2091 9 16 10.7909 16 13C16 15.2091 14.2091 17 12 17Z"></path>
              </svg>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div
              className={` w-[30%] m-auto pt-8 ${
                showUploadProgress ? "" : "hidden"
              }`}>
              <Progress percent={uploadProgress} />
            </div>
            <div className="mt-10 px-8">
              <div className="mb-6">
                <label
                  htmlFor="student_Id"
                  className="block mb-2 text-gray-900 font-bold">
                  MSSV
                </label>
                <input
                  type="text"
                  defaultValue={studentData && studentData.student_Id}
                  id="student_Id"
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                  disabled
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-gray-900 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  defaultValue={studentData && studentData.email}
                  id="email"
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="full_name"
                  className="block mb-2 text-gray-900 font-bold">
                  Họ Và Tên
                </label>
                <input
                  type="text"
                  {...register("full_name")}
                  defaultValue={studentData && studentData.full_name}
                  id="full_name"
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
              </div>
              {/* <div className="mb-6">
                                <label htmlFor="dob" className="block mb-2 text-gray-900 font-bold">Ngày Sinh</label>
                                <input type="date" defaultValue={studentData.dob} {...register('dob')} id="dob" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" />
                            </div> */}
              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block mb-2 text-gray-900 font-bold">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  {...register("address")}
                  defaultValue={studentData && studentData.address}
                  id="address"
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-gray-900 font-bold">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  defaultValue={studentData && studentData.phone}
                  {...register("phone")}
                  id="phone"
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="old_password"
                  className="block mb-2 text-gray-900 font-bold">
                  Thay Đổi Mật Khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu cũ ..."
                  {...register("old_password")}
                  id="old_password"
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới ..."
                  {...register("new_password")}
                  id="new_password"
                  className="border mt-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới ..."
                  {...register("confirm_password")}
                  id="confirm_password"
                  className="border mt-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                />
              </div>
              <div className="mb-6">
                <p className="text-sm text-red-500">{error}</p>
              </div>
              <div className="mb-6 flex justify-end">
                <button
                  type="submit"
                  className="border px-8 py-2 rounded-lg bg-green-700 text-white flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="rgba(255,255,255,1)">
                    <path d="M7 19V13H17V19H19V7.82843L16.1716 5H5V19H7ZM4 3H17L21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM9 15V19H15V15H9Z"></path>
                  </svg>
                  Lưu
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UpdateProfile;
