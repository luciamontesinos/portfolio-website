import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { socialLinks, citiesList } from "../data";
import { Section } from "../styles/shared";

const SocialLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;


`;

const SocialLinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;

  p {
    margin: 0px;
    font-size: 18px;
    color: gray;
  }

  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: red;
    }
  }
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.color};
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: red;
  }
`;

const CityRow = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const HoverInfo = styled.div`
  position: absolute;
  top: -20px;
  left: 0;
  background: transparent;
  color: ${({ theme }) => theme.color};
  font-size: 14px;
  white-space: nowrap;
  z-index: 10;
`;

function Contact() {
  const theme = useTheme();
  const [hoveredCity, setHoveredCity] = useState(null);
  const currentCity = citiesList.find((city) => city.isHome);
  const previousCities = citiesList.filter((city) => !city.isHome);

  return (
    <Section id="contact">
      <h1 onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })} style={{ cursor: 'pointer' }}>CONTACT</h1>

      <div>
        <p1> Get in touch. Currently based in {" "}
          <CityRow
            onMouseEnter={() => setHoveredCity(currentCity)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <span style={{ color: hoveredCity === currentCity ? "red" : theme.color}}>
              {currentCity.city}
            </span>
            {hoveredCity === currentCity && (
              <HoverInfo>{currentCity.organization}</HoverInfo>
            )}
          </CityRow>
          . Previously in {" "}
          {previousCities.map((city, index) => (
            <CityRow
              key={index}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <span
                style={{
                  color: hoveredCity === city ? "red" : theme.color,
                  marginRight: "8px",
                }}
              >
                {city.city}
                {index < previousCities.length - 1 ? "," : "."}
              </span>
              {hoveredCity === city && <HoverInfo>{city.organization}</HoverInfo>}
            </CityRow>
          ))}</p1>
            </div>
              <div>
        <SocialLinksContainer>
          {socialLinks.map((link) => (
            <SocialLinkRow key={link.label}>
              <p>{link.descriptor}:</p> {}
              <SocialLink href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} {}
              </SocialLink>
            </SocialLinkRow>
          ))}
        </SocialLinksContainer>
      </div>
    </Section>
  );
}

export default Contact;
