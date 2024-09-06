import styled, { css } from 'styled-components';

export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
  ${scrollbarStyle}
`;

export const MovieDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-bottom: 10px;
`;

export const MovieDetailsColumn = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5px 10px;
  align-items: start;
`;

export const MovieDetailsLabel = styled.span`
  font-weight: bold;
  white-space: nowrap;
`;

export const MovieDetailsContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CompanyItem = styled.span`
  &:not(:first-child) {
    padding-left: 0;
    margin-left: 0;
  }
`;

export const GenreList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export const GenreItem = styled.li`
  background-color: #e50914;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
`;

export const MovieDescriptionContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

export const MovieDescriptionContent = styled.p`
  margin-bottom: 10px;
  padding: 10px 0;
  font-size: 15px;
`;

export const MoreButton = styled.span`
  color: #e50914;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  margin-left: 5px;
`;

export const TrailerButton = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
  width: fit-content;
`;

export const CastList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 5px;
  ${scrollbarStyle}
`;

export const CastItem = styled.div`
  text-align: center;
  width: 80px;
`;

export const CastImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

export const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

export const KeywordItem = styled.span`
  background-color: transparent;
  color: white;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  font-weight: bolder;

  &:hover {
    text-decoration: underline;
  }
`;