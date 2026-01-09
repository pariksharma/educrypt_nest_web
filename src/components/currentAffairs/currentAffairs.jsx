import React, { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentAffairList, fetchCurrentAffairs } from '@/store/slice/currentAffairSlice';
import { Loader } from '../loader/loader';
import CurrentAffairCard from '../cards/currentAffairCard';

const CurrentAffairs = () => {

  const [tab, setTab] = useState(null)
  const [category_data, setCategory_data] = useState([])
  const [contentData, setContentData] = useState([])

  const dispatch = useDispatch()
  const { categoryData, categoryLoading, categoryError, currentAffairList, currentAffairListLoading, currentAffairListError } = useSelector(state => state?.currentAffair)

  useEffect(() => {
    if(!categoryData) {
        dispatch(fetchCurrentAffairs())
    }
  }, [categoryData])

  useEffect(() => {
    if(categoryData?.responseCode == "3014" && categoryData?.data?.length > 0){
        setCategory_data(categoryData?.data)
        setTab(categoryData?.data[0]?.id)
    } else {
        setCategory_data([])
        setTab('')
    }
  }, [categoryData])

  useEffect(() => {
    if(tab) {
        const payload = {
            category_id: tab.toString(),
            page: '1',
            limit: '100',
        }
        dispatch(fetchCurrentAffairList(payload))
    }
  }, [tab])

 useEffect(() => {
    if(currentAffairList?.responseCode == "3015" && currentAffairList?.data?.length > 0) {
        setContentData(currentAffairList?.data)
    } else {
        setContentData([])
    }
  }, [currentAffairList]) 

  const renderData = () => {
    console.log('content', contentData)
    if(contentData?.length > 0) {
        return contentData?.map((list, ind) => {
            console.log('list', list)
        return <TabPanels className="mt-3" key={ind}>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2'>
                    <CurrentAffairCard
                        list={list}
                    />
                </div>
            </TabPanels>
        })
    } else {
        return <div className='flex flex-col justify-center h-[calc(100vh-190px)] items-center w-full'>
            <img className='w-50' src='/images/no-data.svg' alt='no data' />
            <p>No Data Found</p>
        </div>
    }
  }

  return (
    <>
        {categoryLoading 
        ?
            <Loader />
        :
            (categoryError 
            ?
                "Error"
            :    
                <div className="flex w-full justify-center px-4">
                    <div className="w-full ">
                        <TabGroup>
                            <TabList className="flex gap-4 p-6">
                                {category_data?.length > 0 
                                ?
                                    category_data?.map((cat, index) => {
                                        return  <Tab
                                            className={`px-4 py-1.5 text-md font-semibold text-gray-600 data-selected:activeTab rounded-lg data-selected:active-tab focus-visible:outline-none cursor-pointer ${tab == cat?.id ? "activeTab" : ''}`}
                                            onClick={() => setTab(cat?.id)}
                                            key={index}
                                        >
                                            {cat?.name}
                                        </Tab>
                                    })
                                :
                                    <div className='flex flex-col items-center justify-center h-[calc(100vh-70px)]'>
                                        <img className='w-50' src='/images/no-data.svg' alt='no data' />
                                        <p>No Data Found</p>
                                    </div>
                                }
                            </TabList>
                            {currentAffairListLoading 
                            ? 
                                <Loader />
                            :
                                (currentAffairListError
                                ?
                                    "Error"
                                :
                                    renderData()
                                )
                            }
                        </TabGroup>
                    </div>
                </div>
            )
        }
    </>
  )
}

export default CurrentAffairs