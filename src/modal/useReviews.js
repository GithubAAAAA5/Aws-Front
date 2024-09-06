import { useCallback, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import api from '../Member/api';

const cookies = new Cookies();

console.log('token', cookies.get("accessToken"));

const useReviews = (movie_id, movie_title) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [allStars, setAllStars] = useState(0);
  const [currentUser, setCurrentUser] = useState(null); // currentUser 상태 추가
  const [error, setError] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = cookies.get("accessToken");
      if (token) {
        try {
          const response = await api.get('/api/auth/modify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setCurrentUser(response.data);
          
          // 현재 사용자의 리뷰 존재 여부 확인
          const userReview = reviews.find(review => review.mnick === response.data.mnick);
          setUserHasReviewed(!!userReview);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, [reviews]);

  
  const fetchReviews = useCallback(async () => {
    if (loading || !hasMore) return;
  
    setLoading(true);
    setError(null);
    try {
      const requestData = {
        "movie_id": movie_id,
        "page": page,
        "size": 6
      };
  
      const response = await api.post('/api/review/listOfReviewPaginated', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get("accessToken")}`
        }
      });
  
      const newReviews = (response.data.dtoList || []).map(review => ({
        review_id: review.review_id,
        text: review.review_text,
        rating: review.review_star,
        mnick: review.mnick
      }));
  
      setReviews(prevReviews => {
        const updatedReviews = [...prevReviews, ...newReviews];
        // 현재 사용자의 리뷰 존재 여부 확인
        if (currentUser) {
          const userReview = updatedReviews.find(review => review.mnick === currentUser.mnick);
          setUserHasReviewed(!!userReview);
        }
        return updatedReviews;
      });
      setTotal(response.data.total || 0);
      setAllStars(response.data.allStars || 0);
      setPage(prevPage => prevPage + 1);
      setHasMore(newReviews.length === 6);

    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [movie_id, page, loading, hasMore, currentUser]);

  useEffect(() => {
    setReviews([]); // 영화가 변경될 때 리뷰 목록 초기화
    setPage(0);
    setHasMore(true);
    fetchReviews();
  }, [movie_id]);

  const handleSubmitReview = async () => {
    if (cookies.get("accessToken") !== undefined && currentUser) {
      if (userHasReviewed) {
        alert("이미 이 영화에 대한 리뷰를 작성하셨습니다.");
        return;
      }

      if (review.trim() !== '') {
        try {
          const movieResponse = await api.post('/api/movie/register', {
            "movie_id": movie_id,
            "movie_title": movie_title
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.get("accessToken")}`
            }
          });
  
          if (movieResponse.data.result === movie_id) {
            const reviewResponse = await api.post('/api/review/register', {
              "movie_id": movie_id,
              "review_text": review,
              "review_star": rating
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get("accessToken")}`
              }
            });
        
            const newReview = {
              review_id: reviewResponse.data.result,
              text: review,
              rating: rating,
              mnick: currentUser.mnick
            };
        
            setReviews(prevReviews => [newReview, ...prevReviews]);
            setUserHasReviewed(true);
            setTotal(prevTotal => prevTotal + 1);
            setAllStars(prevAllStars => prevAllStars + rating);
            setReview(''); // 입력창 초기화
            setRating(0); // 별점 초기화
          } else {
            alert("영화 정보가 일치하지 않습니다.");
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          setError('Error submitting review. Please try again later.');
        }
      }
    } else {
      alert("login 해주세요");
    }
  };

  const handleEditReview = async (reviewId, newText, newRating) => {
    if(cookies.get("accessToken") !== undefined){
      try {
        const response = await api.put('/api/review/modify', {
          review_id: reviewId,
          review_text: newText,
          review_star: newRating,
          movie_id: movie_id
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get("accessToken")}`
          }
        });
  
        if (response.data.result === 'success') {
          setReviews(prevReviews => 
            prevReviews.map(review => 
              review.review_id === reviewId 
                ? { ...review, text: newText, rating: newRating }
                : review
            )
          );
          const oldReview = reviews.find(review => review.review_id === reviewId);
          setAllStars(prevAllStars => prevAllStars - oldReview.rating + newRating);
          
        //   // 수정 후 전체 리뷰 목록을 다시 불러옵니다
        //   setPage(0);
        //   setHasMore(true);
        //   await fetchReviews();
        } else {
          setError('Failed to update review in the database.');
        }
      } catch (error) {
        console.error('Error editing review:', error);
        setError('Error editing review. Please try again later.');
      }
    } else {
      alert("로그인 해주세요");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if(cookies.get("accessToken") !== undefined){
      try {
        const response = await api.delete(`/api/review/${reviewId}`, {
          headers: {
            'Authorization': `Bearer ${cookies.get("accessToken")}`
          }
        });
  
        if (response.data.result === 'success') {
          const deletedReview = reviews.find(review => review.review_id === reviewId);
          setReviews(prevReviews => prevReviews.filter(review => review.review_id !== reviewId));
          setTotal(prevTotal => prevTotal - 1);
          setAllStars(prevAllStars => prevAllStars - deletedReview.rating);
  
          // 삭제 후 리뷰 수가 특정 임계값 이하로 떨어지면 추가 리뷰 로드
          if (reviews.length <= 3) {
            fetchReviews();
          }
        } else {
          setError('Failed to delete review from the database.');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Error deleting review. Please try again later.');
      }
    } else {
      alert("로그인 해주세요");
    }
  };

  return { 
    rating, setRating, review, setReview, reviews, 
    handleSubmitReview, fetchReviews, loading, hasMore, 
    total, allStars, error, handleEditReview, handleDeleteReview,
    userHasReviewed
  };
};

export default useReviews;