import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSaveCourseReview,
  fetchDeleteMyReview,
  fetchGetAllReview,
  fetchCourseDetail
} from "@/store/slice/courseSlice";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { HiEllipsisVertical } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import { timeAgo } from "@/utils/helper";
import BtnLoader from "../loader/btnLoader";

const CourseReview = ({ review, id }) => {

  const dispatch = useDispatch();
  const { courseDetails, courseAllContent, allReviewData, saveReviewData, deleteReviewData, loadingAll, loadingAllContent, loadingDetails, allReviewLoading, saveReviewLoading, deleteReviewLoading, error, allReviewError, saveReviewError, deleteReviewError } = useSelector(
    (state) => state.courses
  );

  const [reviews, setReviews] = useState([]);
  const [addReviewsBox, setAddReviewsBox] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewDeleteModal, setReviewDeleteModal] = useState(false);
  const [viewAllReview, setViewAllReview] = useState(false);
  const [allReviewList, setAllReviewList] = useState([]);

  const dropdownRef = useRef(null);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5; // Whether there's a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <img
          key={`full-${i}`}
          className="w-[15px]"
          src="/images/fullStar.svg"
          alt="Full Star"
        />
      );
    }

    // Add half star if needed
    if (halfStar) {
      stars.push(
        <img
          key="half"
          className="w-[15px]"
          src="/images/halfStar.svg"
          alt="Half Star"
        />
      );
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <img
          key={`empty-${i}`}
          className="w-[15px]"
          src="/images/emptyStar.svg"
          alt="Empty Star"
        />
      );
    }

    return stars;
  };

  const RatingBar = (star, value, max, ind) => {
    const width = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="flex items-center gap-2 mt-1" key={ind}>
        <span className="w-3 text-sm font-medium">{star}</span>
        <div className="flex-1 h-2 bg-gray-300 rounded">
          <div
            className={`h-2 rounded ${
              star >= 3 ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${width}%` }}
          ></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setReviews(review?.layout_data)
  }, [review])

  useEffect(() => {
      const handler = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
              setReviewDeleteModal(false);
          }
      };
      window.addEventListener('click', handler);
      return () => window.removeEventListener('click', handler);
  }, []);

  const handleMyReviews = () => {
    if (!userRating) {
      alert("Please select rating");
      return;
    }
    const payload = {
      'rating': userRating.toString(),
      'target_id': id.toString(),
      'target_type': 'course',
      'review': reviewText.toString()
    }
    
    dispatch(fetchSaveCourseReview(payload)).unwrap().then(() => {
      setAddReviewsBox(false);
      dispatch(fetchCourseDetail({ course_id: String(id) }));
      if (viewAllReview) {
        dispatch(fetchGetAllReview({ course_id: String(id), page: "1" }));
      }
    }) .catch((err) => {
      console.error("Review save error:", err);
    });

    console.log('review Submit')
  }

  const handleReviewDelete = (reviewId) => {
    const payload = {
      review_id: reviewId.toString()
    }
    dispatch(fetchDeleteMyReview(payload)).unwrap().then(() => {
      setReviewDeleteModal(false);
      dispatch(fetchCourseDetail({ course_id: String(id) }));
      if (viewAllReview) {
        dispatch(fetchGetAllReview({ course_id: String(id), page: "1" }));
      }
    }) .catch((err) => {
      console.error('review delete err:', err)
    })
    console.log('del:', payload)
  }

  //handle view all review
  const handleViewAllReview = (id) => {
    const payload = {
      'course_id': id.toString(),
      'page': '1'
    }
    dispatch(fetchGetAllReview(payload)).unwrap().then(() => {
      setViewAllReview(true);
    }) .catch((err) => {
      console.error('view all review:', err)
    })
  }

  useEffect(() => {
    if(allReviewData?.data){
      setAllReviewList(allReviewData?.data)
      console.log('all review data:', allReviewList);
    }
  }, [allReviewData])

  useEffect(() => {
    if (reviews?.[0]?.my_list?.[0]) {
      setReviewText(reviews[0].my_list[0].review);
      setUserRating(Number(reviews[0].my_list[0].rating));
    } else {
      setReviewText("");
      setUserRating(0);
    }
  }, [reviews]);

  const StarRating = () => {
    return (
      <div className="flex items-center gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = (hoverRating || userRating) >= star;

          return (
            <FaStar
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                isActive ? "text-yellow-500" : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
            />
          );
        })}
      </div>
    );
  };

  console.log("review:", review?.layout_data);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
        {reviews[0]?.my_list.length == 0 ? (
          <button
            className="px-5 py-2 rounded text-white border border-primary cursor-pointer bg-primary hover-bg-white hover-text-primary text-xs"
            onClick={() => setAddReviewsBox(true)}
          >
            Add Review
          </button>
        ) : (
          <button
            className="px-5 py-2 rounded text-white border border-primary cursor-pointer bg-primary hover-bg-white hover-text-primary text-xs"
            onClick={() => setAddReviewsBox(true)}
          >
            Edit Review
          </button>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <div>
          <h2 className="text-4xl font-bold">
            {review?.layout_data[0]?.average_rating || 0.0}
          </h2>
          <div className="flex items-center gap-1 py-1">
            {renderStars(parseFloat(review?.layout_data[0]?.average_rating))}
          </div>
          <p className="text-sm">
            {review?.layout_data[0]?.average_rating} ratings and{" "}
            {review?.layout_data[0]?.review_count}
          </p>
        </div>
        <div className="w-64">
          {[5, 4, 3, 2, 1].map((star, ind) =>
            RatingBar(
              star,
              review?.layout_data[0]?.summary?.[`star_${star}`],
              parseInt(review?.layout_data[0]?.review_count),
              ind
            )
          )}
        </div>
      </div>
      {/* ALL REVIEWS */}

      {!viewAllReview ? (
        <div className="w-[350px]">
          {reviews?.[0]?.my_list?.map((r, idx) => (
            // console.log('review 1', reviews)
            <div key={idx} className="border-b-gray-500">
              <div className="flex gap-3 p-4">
                <img
                  src="/images/users.png"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-sm">{r.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-green-500 text-white px-2 py-0.5 text-[11px] rounded flex items-center gap-1">
                      <FaStar className="h-2.5 w-2.5" /> {r.rating}
                    </span>
                    <span>{timeAgo(r.created_at)}</span>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setReviewDeleteModal((prev) => !prev)}>
                    <HiEllipsisVertical />
                  </button>
                  {reviewDeleteModal && (
                    <div className="absolute top-4 py-3 px-5 shadow left-0 rounded flex flex-col gap-2">
                      <button
                        className="flex items-center gap-2 text-sm"
                        onClick={() => handleReviewDelete(r.id)}
                      >
                        <RiDeleteBinLine /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-black">{r.review}</p>
            </div>
          ))}
          {reviews?.[0]?.list?.map((r, idx) => (
            // console.log('review 1', reviews)
            <div key={idx} className="border-b-gray-500">
              <div className="flex gap-3 p-4">
                <img
                  src="/images/users.png"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-sm">{r.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-green-500 text-white px-2 py-0.5 text-[11px] rounded flex items-center gap-1">
                      <FaStar className="h-2.5 w-2.5" /> {r.rating}
                    </span>
                    <span>{timeAgo(r.created_at)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs text-black">{r.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-[350px]">
          {allReviewList?.my_list?.map((r, idx) => (
            // console.log('review 1', reviews)
            <div key={idx} className="border-b-gray-500">
              <div className="flex gap-3 p-4">
                <img
                  src="/images/users.png"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-sm">{r.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-green-500 text-white px-2 py-0.5 text-[11px] rounded flex items-center gap-1">
                      <FaStar className="h-2.5 w-2.5" /> {r.rating}
                    </span>
                    <span>{timeAgo(r.created_at)}</span>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setReviewDeleteModal((prev) => !prev)}>
                    <HiEllipsisVertical />
                  </button>
                  {reviewDeleteModal && (
                    <div className="absolute top-4 py-3 px-5 shadow left-0 rounded flex flex-col gap-2">
                      <button
                        className="flex items-center gap-2 text-sm"
                        onClick={() => handleReviewDelete(r.id)}
                      >
                        <RiDeleteBinLine /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-black">{r.review}</p>
            </div>
          ))}
          {allReviewList?.list?.map((r, idx) => (
            // console.log('review 1', reviews)
            <div key={idx} className="border-b-gray-500">
              <div className="flex gap-3 p-4">
                <img
                  src="/images/users.png"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-sm">{r.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-green-500 text-white px-2 py-0.5 text-[11px] rounded flex items-center gap-1">
                      <FaStar className="h-2.5 w-2.5" /> {r.rating}
                    </span>
                    <span>{timeAgo(r.created_at)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs text-black">{r.review}</p>
            </div>
          ))}
        </div>
      )}

      {reviews?.[0]?.list.length >= 2 && (
        <div className="text-right w-[350px]">
          {!viewAllReview ? (
            <button
              className="text-xs text-blue-800 inline-block font-semibold"
              onClick={() => handleViewAllReview(id)}
            >
              {allReviewLoading ? <BtnLoader /> : "View more"}
            </button>
          ) : (
            <button
              className="text-xs text-blue-800 inline-block font-semibold"
              onClick={() => setViewAllReview(false)}
            >
              {allReviewLoading ? <BtnLoader /> : "View less"}
            </button>
          )}
        </div>
      )}

      {addReviewsBox && (
        <div className="fixed inset-0 bg-gray-600/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md p-0 opacity-100 max-h-[calc(100vh-100px)] overflow-hidden overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className='flex flex-col gap-1 bg-white rounded-lg relative px-6 py-4 min-w-[300px]'>
              {reviews[0]?.my_list.length == 0 ? <h1 className="text-normal mb-2 text-center font-bold">Add Review</h1> : <h1 className="text-normal mb-2 text-center font-bold">Edit Review</h1>}
              <div className="flex flex-col gap-2">
                <StarRating />
                <textarea name="myreview" id="myReview" value={reviewText} className="border border-gray-300 rounded mt-2 text-xs p-1 text-gray-600" rows={3} onChange={(e) => setReviewText(e.target.value)}></textarea>
                <div className="mt-2 flex items-center justify-end gap-3">
                  <button className="px-5 py-2 rounded text-primary border border-primary cursor-pointer bg-white hover-bg-primary hover-text-white text-xs" onClick={() => setAddReviewsBox(false)}>Cancel</button>
                  <button className="px-5 py-2 rounded text-white border border-primary cursor-pointer bg-primary hover-bg-white hover-text-primary text-xs" onClick={() => handleMyReviews()} disabled={saveReviewLoading}>
                    {saveReviewLoading ? <BtnLoader /> : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseReview;
