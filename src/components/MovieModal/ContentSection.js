import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import * as S from './ContentSectionStyles';
import useMovieKeywords from '../hooks/useMovieKeywords';

const ContentSection = ({ 
  movie, 
  director, 
  runtime, 
  genres, 
  cast, 
  productionCompanies, 
  trailerId, 
  setShowTrailer,
  onKeywordClick,
  onGenreClick,
  clearSearchValue
}) => {
  const [showFullOverview, setShowFullOverview] = useState(false);
  const { keywords, error } = useMovieKeywords(movie.id);

  // 영화 설명을 주어진 길이로 자르는 함수
  const truncateOverview = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength);
  };

  // 장르 클릭 핸들러
  const handleGenreClick = (genreId, genreName) => {
    if (typeof onGenreClick === 'function') {
      onGenreClick(genreId, genreName);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
  };

  // 키워드 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    if (typeof onKeywordClick === 'function') {
      onKeywordClick(keyword);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
  };

  return (
    <S.Wrapper>
      <S.MovieDetailsContainer>
        <S.MovieDetailsColumn>
          <S.MovieDetailsLabel>개봉일:</S.MovieDetailsLabel>
          <S.MovieDetailsContent>{movie.release_date}</S.MovieDetailsContent>
          <S.MovieDetailsLabel>평점:</S.MovieDetailsLabel>
          <S.MovieDetailsContent>{Number(movie.vote_average).toFixed(1)}</S.MovieDetailsContent>
          <S.MovieDetailsLabel>러닝타임:</S.MovieDetailsLabel>
          <S.MovieDetailsContent>{runtime}분</S.MovieDetailsContent>
        </S.MovieDetailsColumn>
        <S.MovieDetailsColumn>
          <S.MovieDetailsLabel>감독:</S.MovieDetailsLabel>
          <S.MovieDetailsContent>{director}</S.MovieDetailsContent>
          <S.MovieDetailsLabel>제작사:</S.MovieDetailsLabel>
          <S.CompanyList>
            {productionCompanies.slice(0, 2).map((company, index) => (
              <S.CompanyItem key={company.id}>
                {index === 0 ? company.name + ',' : company.name}
              </S.CompanyItem>
            ))}
          </S.CompanyList>
        </S.MovieDetailsColumn>
      </S.MovieDetailsContainer>

      <S.GenreList>
        장르 :
        {genres && genres.map(genre => (
          <S.GenreItem 
            key={genre.id}
            onClick={() => handleGenreClick(genre.id, genre.name)}
          >
            {genre.name}
          </S.GenreItem>
        ))}
      </S.GenreList>

      <S.MovieDescriptionContainer>
        <S.MovieDescriptionContent>
          {showFullOverview ? movie.overview : truncateOverview(movie.overview, 400)}
          {movie.overview.length > 400 && (
            <S.MoreButton onClick={() => setShowFullOverview(!showFullOverview)}>
              {showFullOverview ? '접기' : '더보기'}
            </S.MoreButton>
          )}
        </S.MovieDescriptionContent>
      </S.MovieDescriptionContainer>

      {trailerId && (
        <S.TrailerButton onClick={() => setShowTrailer(true)}>
          <FaPlay style={{ marginRight: '10px' }} /> 예고편 보기
        </S.TrailerButton>
      )}

      <S.CastList>
        {cast.slice(0, 7).map(actor => (
          <S.CastItem key={actor.id}>
            <S.CastImage 
              src={actor.profile_path 
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                : '../../img/NoActorImage.png'} 
              alt={actor.name} 
            />
            <p>{actor.name}</p>
          </S.CastItem>
        ))}
      </S.CastList>

      {error ? (
        <p>{error}</p>
      ) : (
        <S.KeywordList>
          키워드:
          {keywords.slice(0, 10).map((keyword, index, array) => (
            <S.KeywordItem 
              key={keyword.id} 
              onClick={() => handleKeywordClick(keyword.name)}
            >
              {keyword.name}
              {index < array.length - 1 ? ',' : ''}
            </S.KeywordItem>
          ))}
        </S.KeywordList>
      )}
    </S.Wrapper>
  );
};

export default ContentSection;