import { useState, useEffect } from "react";
import styled from "styled-components";
import { Section } from "../styles/shared";

const PublicationsList = styled.div`
   text-align: justify;

  div {
    font-size: 20px;
    color: ${({ theme }) => theme.color};
    text-align: justify;
}
    p {
      font-size: 20px;
      margin-bottom: 16px;
    }

    ul {
      font-size: 20px;
      margin: 16px 0;
      padding-left: 20px;
    }

    li {
      font-size: 20px;
      margin-bottom: 8px;
      list-style: none;
      position: relative;
    }

    li::before {
      content: "→";
      position: absolute;
      left: -40px;
      top: -12px;
      color: red;
      font-size: 40px;
    }

`;

function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(
          "https://pub.orcid.org/v3.0/0009-0002-1438-6461/works",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch publications: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const works = await Promise.all(
          data.group.map(async (work) => {
            const summary = work["work-summary"][0];
            const title = summary["title"]["title"]["value"];
            const doi = summary["external-ids"]["external-id"].find(
              (id) => id["external-id-type"] === "doi"
            )?.["external-id-value"];

            let additionalData = {};
            if (doi) {
              try {
                // Check if it's a Zenodo DOI (10.5281)
                const isZenodoDOI = doi.includes("10.5281");

                if (isZenodoDOI) {
                  // Try Zenodo API first for Zenodo DOIs
                  try {
                    const zenodoResponse = await fetch(`https://zenodo.org/api/records/?q=doi:${doi}`);
                    if (zenodoResponse.ok) {
                      const zenodoData = await zenodoResponse.json();
                      if (zenodoData.hits.total > 0) {
                        const record = zenodoData.hits.hits[0].metadata;
                        const publicationDate = record.publication_date || "";
                        const resourceSubtype = record.resource_type?.subtype || "";

                        // Base data
                        additionalData = {
                          publisher: record.communities?.[0]?.title || "Zenodo",
                          type: record.resource_type?.title || "Unknown",
                          authors: record.creators
                            ? record.creators.map((creator) => creator.name).join(", ")
                            : "Unknown Authors",
                          date: publicationDate.split("-")[0] || "Unknown Date",
                          volume: "",
                          issue: "",
                          page: "",
                          abstract: record.description || "No description available",
                          event: "",
                          acronym: "",
                          url: record.links?.html || "No URL available",
                        };

                        // Extract fields based on resource subtype
                        if (resourceSubtype === "article" && record.journal) {
                          additionalData.venue = record.journal.title || "Unknown Journal";
                          additionalData.volume = record.journal.volume || "";
                          additionalData.issue = record.journal.issue || "";
                          additionalData.page = record.journal.pages || "";
                        } else if (resourceSubtype === "conferencepaper" && record.meeting) {
                          additionalData.venue = record.meeting.title || "Unknown Conference";
                          additionalData.event = record.meeting.title || "";
                          additionalData.acronym = record.meeting.acronym || "";
                        } else {
                          // Fallback for other types
                          additionalData.venue = record.resource_type?.title || "Zenodo Repository";
                        }
                        console.log(record);
                      }
                    }
                  } catch (zenodoError) {
                    console.error(`Error fetching Zenodo data for DOI ${doi}:`, zenodoError);
                  }
                }

                // If no data from Zenodo or not a Zenodo DOI, try Crossref
                if (Object.keys(additionalData).length === 0) {
                  const crossRefResponse = await fetch(`https://api.crossref.org/works/${doi}`);
                  if (crossRefResponse.ok) {
                    const crossRefData = await crossRefResponse.json();
                    additionalData = {
                      publisher: crossRefData.message.publisher || "Unknown Publisher",
                      type: crossRefData.message.type || "Unknown Type",
                      authors: crossRefData.message.author
                        ? crossRefData.message.author.map((author) => `${author.given} ${author.family}`).join(", ")
                        : "Unknown Authors",
                      venue: crossRefData.message["container-title"] ? crossRefData.message["container-title"].join(", ") : "Unknown Venue",
                      date: crossRefData.message["published-print"]?.["date-parts"][0][0] || crossRefData.message["published-online"]?.["date-parts"][0][0] || "Unknown Date",
                      volume: crossRefData.message.volume || "",
                      issue: crossRefData.message.issue || "",
                      page: crossRefData.message.page || crossRefData.message["article-number"] || "",
                      abstract: crossRefData.message.abstract || "No abstract available",
                      event: crossRefData.message["event"]?.["name"] || "No event information available",
                      url: crossRefData.message.URL || "No URL available",
                    };
                  }
                }
              } catch (error) {
                console.error(`Error fetching metadata for DOI ${doi}:`, error);
              }
            }

            return { title, doi, ...additionalData };
          })
        );

        setPublications(works);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching publications:", error);
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <Section id="publications">
      <h1>PUBLICATIONS</h1>
      {loading ? (
        <p>Finding the latest publications...</p>
      ) : publications.length > 0 ? (

        <PublicationsList>

          <ul>
            {publications.map((pub, index) => {
              // Build citation string with available data
              const citationParts = [];

              if (pub.authors) citationParts.push(<em key="authors">{pub.authors}</em>);
              if (pub.date) citationParts.push(` (${pub.date})`);

              const journalParts = [];
              if (pub.venue) journalParts.push(pub.venue);
              if (pub.volume) journalParts.push(`${pub.volume}`);
              if (pub.issue) journalParts.push(`(${pub.issue})`);
              if (pub.page) journalParts.push(`pp. ${pub.page}`);

              const journalSection = journalParts.length > 0 ? journalParts.join(", ") : "";

              return (
                <li key={index} style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
                    <strong>{pub.title}</strong>. {citationParts}
                    {journalSection && (
                      <>
                        . <em>{journalSection}</em>
                      </>
                    )}
                    {pub.doi && (
                      <>
                        . DOI:{" "}
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "red" }}
                        >
                          {pub.doi}
                        </a>
                      </>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </PublicationsList>
      ) : (
        <p>No publications found. Weird. I do have some, so maybe try searching for my name in Google Scholar</p>
      )}
    </Section>
  );
}

export default Publications;
