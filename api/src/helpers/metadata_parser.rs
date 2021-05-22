use scraper::{Html, Selector};

use crate::types::ParsedMetadata;

pub struct MetadataParser<'a> {
    html: &'a Html,
}

impl<'a> MetadataParser<'a> {
    pub fn new(html: &Html) -> MetadataParser {
        MetadataParser { html }
    }

    pub fn parse(&self) -> ParsedMetadata {
        let title = self.parse_title();
        let description = self.parse_description();
        let image = self.parse_image();

        ParsedMetadata {
            title,
            description,
            image,
        }
    }

    fn parse_title(&self) -> Option<String> {
        // let title_selector =
        //     Selector::parse(r#"meta[name="title"],meta[property="og:site_name"]"#).unwrap();
        let title_selector = Selector::parse(r#"title"#).unwrap();
        let title_el = &self.html.select(&title_selector).next();

        // println!("EL: {:?}", title_el);

        match title_el {
            None => None,
            Some(title_el) => {
                let title = title_el.text().next();
                match title {
                    None => None,
                    Some(title) => Some(String::from(title)),
                }
            }
        }
    }

    fn parse_description(&self) -> Option<String> {
        let description_selector = Selector::parse(r#"meta[name="description"]"#).unwrap();
        let description_el = &self.html.select(&description_selector).next();

        match description_el {
            None => None,
            Some(description_el) => {
                let description = description_el.value().attr("content");
                match description {
                    None => None,
                    Some(description) => Some(String::from(description)),
                }
            }
        }
    }

    fn parse_image(&self) -> Option<String> {
        let image_selector =
            Selector::parse(r#"meta[itemprop="image"],meta[property="og:image"]"#).unwrap();
        let image_el = &self.html.select(&image_selector).next();

        match image_el {
            None => None,
            Some(image_el) => {
                let image = image_el.value().attr("content");
                match image {
                    None => None,
                    Some(image) => Some(String::from(image)),
                }
            }
        }
    }
}
