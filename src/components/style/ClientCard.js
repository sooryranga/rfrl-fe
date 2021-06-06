import styled from 'vue-styled-components';

export const CardWrapper = styled.div`
  overflow: hidden;
  box-shadow: 0px 2px 8px 0px var(--clr-gray-light);
  background-color: white;
  border-radius: 1rem;
  position: relative;
  margin: 0.5rem;
`;

export const ProfileImage = styled.img`
width: 8rem;
clip-path: circle(60px at center);
margin-top: 1rem;
margin-left: 1rem;
`;


export const Name = styled.p`
font-weight: bold;
font-size: 1.5rem;
margin-left: 1rem;
`;

export const WorkVerification = styled.p`
display: inline;
font-size: 0.9rem;
margin-left: 1rem;
`;
