import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../loader/loader';
import BtnLoader from '../loader/btnLoader';
import Select from 'react-select';
import { fetchCities, fetchCountries, fetchStates, resetCities } from '@/store/slice/authSlice';


const EditProfile = ({profileData, handleBack, handleSave}) => {

  const [editData, setEditData] = useState({
  name: profileData?.name || '',
  state: null,
  city: null,
});

  const { updateProfileLoading, updateProfileError } = useSelector((state) => state?.user)

  const dispatch = useDispatch()
  const { states, cities } = useSelector((state) => state?.auth)

  // useEffect(() => {
  //   const STATIC_COUNTRY_ID = '1';
  //   dispatch(fetchCountries());
  //   dispatch(fetchStates({ country_id: STATIC_COUNTRY_ID }))
  // }, [])

  useEffect(() => {
  if (!states?.length) {
    dispatch(fetchStates({ country_id: "1" }));
  }
}, [dispatch, states]);

// 2. State pre-select + cities load
useEffect(() => {
  if (states?.length && profileData?.state_id && !editData.state) {
    const matched = states.find(s => String(s.id) === String(profileData.state_id));
    if (matched) {
      const stateOption = { value: matched.id, label: matched.state_name };
      setEditData(prev => ({ ...prev, state: stateOption }));
      
      dispatch(resetCities());
      dispatch(fetchCities({ state_id: matched.id }));
    }
  }
}, [states, profileData?.state_id, dispatch, editData.state]);

// 3. City pre-select
useEffect(() => {
  if (cities?.length && profileData?.city_id && editData.state) {
    const matched = cities.find(c => String(c.id) === String(profileData.city_id));
    if (matched) {
      setEditData(prev => ({
        ...prev,
        city: { value: matched.id, label: matched.city_name }
      }));
    }
  }
}, [cities, profileData?.city_id, editData.state]);

  const onStateChange = (opt) => {
    const id = opt?.value ?? '';
    console.log('id', opt)
    setEditData((prev) => ({
      ...prev,
      state: opt,   
    }));
    // clear previous cities
    dispatch(resetCities());
    if (id) {
      dispatch(fetchCities({ state_id: id }));
    }
  };

  const onCityChange = (opt) => {
    const id = opt?.value ?? '';
    setEditData(
      (prev) => ({
      ...prev,
      city: opt, 
    })
    );
  };
  

  const handleInput = (e) => {
    const {name, value} = e.target;
    setEditData((prev) => ({
      ...prev,
      name: value
    }))
  }

  const stateOptions = (states || []).filter(Boolean).map((s) => ({ value: s.id, label: s.state_name }));
  const cityOptions = (cities || []).filter(Boolean).map((c) => ({ value: c.id, label: c.city_name }));


  return (<>
    <div className='text-sm pt-2 pl-2'>
      <span className='flex items-center cursor-pointer' onClick={handleBack}><FaChevronLeft /> Back</span>
    </div>
    <div className="m-4 mr-20">
      <div className="shadow rounded-lg px-10 pt-2 pb-5">
        <h1 className="text-lg font-bold">Edit Profile</h1>
        <div className="flex flex-row mt-5">
          <div className="w-40 relative">
            <img className="w-30" src="/images/profile.png" alt="profile" />
            <img className="w-5 absolute right-10 top-20" src="/images/cameraImg.svg" alt="profile" />
          </div>
          <div>
            <ul className="flex flex-col gap-4 ml-10">
              <li className="text-md text-black-700 flex flex-col font-semibold">
                {" "}
                <span className="min-w-40 text-gray-800">Name</span>{" "}
                <input className='border rounded-lg w-70 h-10 px-2' type='text' name='name' placeholder={editData?.name} value={editData?.name} onChange={(e) => handleInput(e)} />
              </li>
              <li className="text-md text-black-700 flex flex-col font-semibold">
                <span className="min-w-40 text-gray-800">Email</span>{" "}
                <input className='border rounded-lg w-70 h-10 px-2 bg-gray-200' type='text' disabled name='email' placeholder={editData?.email} />
              </li>
              <li className="text-md text-black-700 flex flex-col font-semibold">
                <span className="min-w-40 text-gray-800">Mobile Number</span>{" "}
                <input className='border rounded-lg w-70 h-10 px-2 bg-gray-200' type='text' disabled name='mobile' placeholder={editData?.mobile} />
              </li>
              <li className="text-md text-black-700 flex flex-col font-semibold">
                <span className="min-w-40 text-gray-800">State</span>{" "}
                {/* <input className='border rounded-lg w-70 h-10 px-2' type='text' name='name' placeholder={editData?.state} /> */}

                <Select
                  options={stateOptions}
                  onChange={onStateChange}
                  value={editData?.state || null}
                  placeholder={'Select State'}
                  isClearable
                />
              </li>
              <li className="text-md text-black-700 flex flex-col font-semibold">
                <span className="min-w-40 text-gray-800">City</span>{" "}
                {/* <input className='border rounded-lg w-70 h-10 px-2' type='text' name='name' placeholder={editData?.city} /> */}
                <Select
                  options={cityOptions}
                  onChange={onCityChange}
                  value={editData?.city || null}
                  placeholder={'Select City'}
                  isClearable
                />
              </li>
            </ul>
            <div className="mt-6 flex gap-2 ml-10">
              <button className="text-sm bg-primary border border-primary text-white w-30 py-2 flex items-center rounded-lg justify-center hover-bg-white hover-text-primary transition cursor-pointer btnbg" onClick={() => {
                updateProfileLoading 
                ? 
                  '' 
                :
                  handleSave(editData)
              }}>
                {updateProfileLoading ? <BtnLoader /> : 'Save'}
              </button>
              <button className="text-sm bg-white border border-primary text-primary w-30 py-2 flex items-center rounded-lg justify-center hover-bg-primary hover-text-white transition cursor-pointer" onClick={handleBack}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default EditProfile