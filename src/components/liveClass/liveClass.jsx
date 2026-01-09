import { fetchLiveClass } from '@/store/slice/courseSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../loader/loader'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import LiveClassCard from '../cards/liveClassCard';
import { BiTab } from 'react-icons/bi';

const LiveClass = () => {

    const [tab, setTab] = useState('1')

    const dispatch = useDispatch()
    const { liveClassData, liveClassLoading, liveClassError} = useSelector(state => state?.courses)

    useEffect(() => {
        const payload = {
            type: tab.toString(),
            page: "1",
            limit: "10"
        }
        dispatch(fetchLiveClass(payload))
    }, [tab])

    useEffect(() => {
        if(liveClassData?.responseCode == '3008'){

        }
    }, [liveClassData])

    const renderData = () => {
        if(liveClassData?.responseCode == '3008' || liveClassData?.responseCode == '3007' || liveClassData?.responseCode == '3009'){
            return <TabPanels>
                <TabPanel className="mt-3">
            {liveClassData?.data?.length > 0 && liveClassData?.data?.map((data, index) => {
                console.log('adsad')
                return <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-2' key={index}>
                        <LiveClassCard
                            tab={tab}
                            data ={data}
                        />
                    </div>
            })
        }
        </TabPanel>
            </TabPanels>
        }
    }

  return (
    <>
        {liveClassLoading 
        ?
            <Loader />
        :
            (liveClassError
            ?
                "error"
            :
                <div className="flex w-full justify-center px-4">
                    <div className="w-full ">
                        <TabGroup>
                            <TabList className="flex gap-4 p-6">
                                <Tab
                                    className={`px-3 py-1 text-lg font-semibold text-gray-600 data-selected:activeTab rounded-lg data-selected:active-tab focus-visible:outline-none cursor-pointer ${tab == "1" ? "activeTab" : ''}`}
                                    onClick={() => setTab("1")}
                                >
                                    LIVE
                                </Tab>
                                <Tab
                                    className={`px-3 py-1 text-lg font-semibold text-gray-600 data-selected:activeTab rounded-lg data-selected:active-tab focus-visible:outline-none cursor-pointer ${tab == "0" ? "activeTab" : ''}`}
                                    onClick={() => setTab("0")}
                                >
                                    UPCOMING
                                </Tab>
                                <Tab
                                    className={`px-3 py-1 text-lg font-semibold text-gray-600 data-selected:activeTab rounded-lg data-selected:active-tab focus-visible:outline-none cursor-pointer ${tab == "2" ? "activeTab" : ''}`}
                                    onClick={() => setTab("2")}
                                >
                                    COMPLETED
                                </Tab>
                            </TabList>
                            {renderData()}
                        </TabGroup>
                    </div>
                </div>
            )
        }
    </>
  )
}

export default LiveClass