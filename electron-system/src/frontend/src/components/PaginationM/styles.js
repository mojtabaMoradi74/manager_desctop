import styled from 'styled-components';
export const Div_pagination_wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
transition: all 0.2s linear;

.paginationIcon {
  transition: all 0.2s linear;
  opacity:1;
  z-index:10;
  &.activated {
    color: #121212;
    font-weight: bold;
    font-size: 1rem;
  }
  &.hidden-element{
    opacity:0;
    z-index:-1;
  }
  width: 30px;
  height: 30px;
  background-color: transparent;
  margin: 0.5rem;
  border-radius: 100%;
  color: #8f8f8f;
  cursor: pointer;
  transition: all 0.2s linear;
  &.translateR:hover {
    transform: translateX(2px);
  }
  &.translateL:hover {
    transform: translateX(-2px);
  }
  &.translateT:hover {
    transform: translateY(-2px);
  }
  i {
    font-size: 0.8rem;
    font-weight: 100;
  }
}
@media (max-width: 450px) {
  .paginationIcon {
    &.translateR {
      display: none;
    }
    &.translateL {
      display: none;
    }
  }
}
`;

