import {
  getMyProfile,
  resetUpdateProfileData,
  updateProfile,
} from "@/store/slice/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../loader/loader";
import { MdModeEdit } from "react-icons/md";
import EditProfile from "./editProfile";
import { isLogin } from "@/utils/helper";
import UpdatePassword from "../modals/updatePassword";
import { fetchStates, fetchCities } from "@/store/slice/authSlice";

const MyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [screenStatus, setScreenStatus] = useState("profile");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { userData, userLoading, userError, updateProfileData } = useSelector(
    (state) => state?.user
  );

  const { states, cities } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLogin()) {
      dispatch(getMyProfile());
    } else if (userData?.responseCode == "2004") {
      setProfileData(userData?.data[0]);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(fetchStates({ country_id: "1" }));
  }, [dispatch]);

  useEffect(() => {
    if (profileData?.state_id && states?.length > 0) {
      dispatch(fetchCities({ state_id: profileData.state_id }));
    }
  }, [profileData?.state_id, states, dispatch]);

  const handleBack = () => {
    setScreenStatus("profile");
  };

  const handleSave = (data) => {
    console.log("data", data);
    const payload = {
      email: profileData.email.toString(),
      mobile: profileData?.mobile,
      name: data?.name?.toString(),
      c_code: "+91",
      device_token: "dfg1xcvbcvcvcnvnnewwsdfwerw234567890",
      state_id: data?.state?.value.toString(),
      city_id: data?.city?.value.toString(),
    };
    dispatch(updateProfile(payload));
  };

  useEffect(() => {
    if (updateProfileData?.responseCode == "2006") {
      dispatch(resetUpdateProfileData());
      handleBack();
    }
  }, [updateProfileData]);

  const getStateName = (id) => {
    if (!id) return "N/A";
    return (
      states?.find((s) => String(s.id) === String(id))?.state_name || "N/A"
    );
  };

  const getCityName = (id) => {
    if (!id) return "N/A";
    return cities?.find((c) => String(c.id) === String(id))?.city_name || "N/A";
  };

  console.log("profile:", profileData);

  const renderContent = () => {
    switch (screenStatus) {
      case "profile":
        return (
          <div className="m-4 mr-20">
            <div className="shadow rounded-lg p-10">
              <h1 className="text-lg font-bold">Profile</h1>
              <div className="flex flex-row mt-8">
                <div className="w-40">
                  <img
                    className="w-30"
                    src="/images/profile.png"
                    alt="profile"
                  />
                </div>
                <div>
                  <ul className="flex flex-col gap-6 ml-10">
                    <li className="text-md text-black-700 flex items-center font-semibold">
                      {" "}
                      <span className="min-w-40 text-gray-400">Name</span>{" "}
                      {profileData?.name ? profileData?.name : "null"}
                    </li>
                    <li className="text-md text-black-700 flex items-center font-semibold">
                      <span className="min-w-40 text-gray-400">Email</span>{" "}
                      {profileData?.email ? profileData?.email : "null"}
                    </li>
                    <li className="text-md text-black-700 flex items-center font-semibold">
                      <span className="min-w-40 text-gray-400">
                        Mobile Number
                      </span>{" "}
                      {profileData?.c_code ? profileData?.c_code : ""}{" "}
                      {profileData?.mobile ? profileData?.mobile : "null"}
                    </li>
                    <li className="text-md text-black-700 flex items-center font-semibold">
                      <span className="min-w-40 text-gray-400">State</span>{" "}
                      {getStateName(
                        profileData?.state_id ? profileData?.state_id : "null"
                      )}
                    </li>
                    <li className="text-md text-black-700 flex items-center font-semibold">
                      <span className="min-w-40 text-gray-400">City</span>{" "}
                      {getCityName(
                        profileData?.city_id ? profileData?.city_id : "null"
                      )}
                    </li>
                  </ul>
                  <div className="mt-6 flex gap-2 ml-10">
                    <button
                      className="text-sm bg-primary border border-primary text-white w-15 py-1 flex items-center rounded-lg justify-center hover-bg-white hover-text-primary transition cursor-pointer"
                      onClick={() => setScreenStatus("edit")}
                    >
                      <MdModeEdit /> Edit
                    </button>
                    <button
                      className="text-sm bg-white border border-primary text-primary w-30 py-2 flex items-center rounded-lg justify-center hover-bg-primary hover-text-white transition cursor-pointer"
                      onClick={() => setOpen(true)}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "edit":
        return (
          <EditProfile
            profileData={profileData}
            handleBack={handleBack}
            handleSave={handleSave}
          />
        );
    }
  };

  return (
    <>
      <UpdatePassword
        closeModal={() => setOpen(false)}
        open={open}
        mobile={profileData?.mobile}
      />
      {userLoading ? <Loader /> : renderContent()}
    </>
  );
};

export default MyProfile;
