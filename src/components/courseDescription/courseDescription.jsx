import React from 'react'
import CourseReview from '../courseReview/courseReview'
import Faq from '../faq/faq'

const CourseDescription = ({description, review, faq, id}) => {
    
  return (<>
    <div dangerouslySetInnerHTML={{__html: description?.layout_data[0]?.description}} />
    {
        <div className='my-12'>
            <CourseReview
                review = {review}
                id = {id}
            />
            {faq?.layout_data?.length > 0 &&
                <Faq
                    faqList={faq?.layout_data}
                />
            }
        </div>
    }
  </>
  )
}

export default CourseDescription