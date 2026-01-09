'use client';

import { fetchContent } from '@/store/slice/courseSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { Loader } from '../loader/loader';
import ContentDetail from './contentDetail';

const Content = ({detail}) => {

    const [folder_id, setFolder_id] = useState('')
    const [page, setPage] = useState(1)
    const [breadCrumb, setBreadCrumb] = useState([])
    const [folderData, setFolderData] = useState([]);
    const [fileData, setFileData] = useState([]);

    const dispatch = useDispatch()
    const { contentData, contentLoading, contentError } = useSelector(state => state?.courses)

    console.log('contentData', contentData)

    useEffect(() => {
        setBreadCrumb([])
        setFolder_id('')
    }, [])

    useEffect(() => {
        const payload = {
            course_id: (detail?.layout_data[0]?.id).toString(),
            folder_id: (folder_id || '').toString(),
            page: (page || 1).toString(),
            limit: "100"
        }
        console.log('payload', payload)
        dispatch(fetchContent(payload))
    }, [folder_id])

    useEffect(() => {
        if(contentData?.responseCode == "3006") {
            setFolderData(contentData?.data?.folder_list)
            setFileData(contentData?.data?.file_list)
        } else if(folderData?.length > 0 && contentData?.responseCode == "404") {
            setFolderData([]);
            setFileData([])
        }
    }, [contentData])

    const handleFolder = (folder) => {
        setFolder_id(folder.id);
        setBreadCrumb((prev) => [...prev, folder])
    }

    const handleBreadCrumb = (data) => {
        const index = breadCrumb?.findIndex((item) => item?.title == data?.title);
        setBreadCrumb((prev) => prev.slice(0, index));
        if(index > 0) {
            setFolder_id(breadCrumb[index-1]?.id)
        }
        else{
            setFolder_id('')
        }
    }

  return (
    <div className="space-y-4">
        {folder_id !== "0" && (
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
                
                {breadCrumb?.length > 0 && (
                    breadCrumb.slice(-2).map((data, index) =>
                        <button className="cursor-pointer flex items-center"
                            onClick={() => handleBreadCrumb(data)}
                            key={index}
                        >
                            {data?.title}
                            <span><MdKeyboardArrowRight /></span>
                        </button>
                    )
                )}
            </div>
        )}
        <div>
            {contentLoading 
            ? 
                <Loader /> 
            :
                ((contentError || folderData?.length == 0)
                ? 
                    <div>
                        <img src='/images' alt='error' />
                    </div> 
                :
                    <>
                    {folderData?.length > 0  &&
                        folderData?.map((folder, index) => {
                            return <div
                                key={index}
                                onClick={() => handleFolder(folder)}
                                className="p-3 bg-white rounded-xl shadow-lg flex items-center justify-between my-1 cursor-pointer hover:bg-secondary"
                            >
                                <div className="flex items-center gap-3">
                                    {folder.icon !== null ? <img src={folder.icon} className="w-10" /> : <img src='/images/folder.png' className="h-15" />}
                                
                                    <div>
                                    <h4 className="font-semibold">{folder.title}</h4>
                                    {folder.content_counts && (
                                        <p className="text-xs mt-1 text-gray-600">
                                        PDFs: {(folder.content_counts.pdf?.free || 0) + (folder.content_counts.pdf?.paid || 0)},
                                        Videos: {(folder.content_counts.video?.free || 0) + (folder.content_counts.video?.paid || 0)},
                                        Tests: {(folder.content_counts.test?.free || 0) + (folder.content_counts.test?.paid || 0)}
                                        </p>
                                    )}
                                    </div>
                                </div>
                                <div className="h-5.5 w-5.5 p-1 rounded-full flex items-center justify-center bg-gray-200">
                                    <IoIosArrowForward />
                                </div>
                            </div>
                        })
                    }
                    {fileData?.length > 0 &&
                        <div className="space-y-3 mt-2">
                            {fileData?.map((file, index) => {
                                return <ContentDetail
                                    data = {file}
                                    key = {index}
                                    detail = {detail}
                                />
                            })}
                        </div>
                    }
                    </>
                )
            }
        </div>
    </div>
  )
}

export default Content