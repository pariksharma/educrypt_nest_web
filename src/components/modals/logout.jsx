import { logout, logoutUser } from "@/store/slice/authSlice";
import localStore from "@/utils/localStore";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { useDispatch } from "react-redux";

const Logout = ({ open, closeLoginModal }) => {

    const dispatch = useDispatch()

    // const handleLogout = () => {
    //     dispatch(logoutUser())
    // }

    const handleLogout = async () => {
        try {
            // console.log("Logging out, token:", localStore.getToken());
 
            await dispatch(logoutUser()).unwrap();
 
            dispatch(logout());
 
            localStorage.setItem("logout_toast", JSON.stringify({ type: "success", msg: "Logged out successfully" }));
            window.location.href = "/";
        } catch (err) {
            console.error("Logout failed:", err);
            localStore.clearAllAuth();
            dispatch(logout());
            localStorage.setItem("logout_toast", JSON.stringify({ type: "error", msg: err || "Logout failed" }));
            window.location.href = "/";
        }
    };
 

  return (
    <Dialog open={open} onClose={closeLoginModal} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center ">
        <DialogPanel className=" max-w-sm rounded-lg bg-white shadow-xl py-3">
          
          <h2 className="text-lg font-semibold pb-2 text-center">Logout</h2>
          <p className="text-sm text-gray-600 text-center px-10">Are you sure you want to Log out
from this account?</p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={closeLoginModal}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 rounded bg-primary text-white hover:bg-red-700 text-sm cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

        </DialogPanel>
      </div>

    </Dialog>
  );
}

export default Logout;
