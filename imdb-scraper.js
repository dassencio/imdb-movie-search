#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function getTop250Movies() {
  console.error('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    console.error('Navigating to IMDb Top 250...');
    await page.goto('https://www.imdb.com/chart/top/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for the movie list to load
    await page.waitForSelector('li.ipc-metadata-list-summary-item', { timeout: 10000 });

    // Scroll to load all movies if needed
    console.error('Scrolling to ensure all movies are loaded...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait a bit more for any lazy loading
    await page.waitForTimeout(2000);

    console.error('Extracting movie data...');
    const movies = await page.evaluate(() => {
      const movieElements = document.querySelectorAll('li.ipc-metadata-list-summary-item');
      const movieList = [];

      movieElements.forEach((element, index) => {
        try {
          // Extract movie title
          const titleElement = element.querySelector('h3.ipc-title__text');
          let title = 'N/A';
          if (titleElement) {
            title = titleElement.textContent.trim();
            // Remove the ranking number (e.g., "1. The Shawshank Redemption" -> "The Shawshank Redemption")
            const match = title.match(/^\d+\.\s*(.+)$/);
            if (match) {
              title = match[1];
            }
          }

          // Extract rating
          const ratingElement = element.querySelector('span.ipc-rating-star--imdb');
          let rating = null;
          if (ratingElement) {
            const ratingText = ratingElement.textContent.trim();
            const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
            if (ratingMatch) {
              rating = parseFloat(ratingMatch[1]);
            }
          }

          // Extract metadata (which includes genres)
          const metadataElements = element.querySelectorAll('span.cli-title-metadata-item');
          let genres = ['N/A'];

          // Try to find genres in metadata
          metadataElements.forEach(meta => {
            const text = meta.textContent.trim();
            // Check if this looks like a genre (not a year or duration)
            if (text && !text.match(/^\d{4}$/) && !text.match(/^\d+h/) && !text.includes('min')) {
              // This might be a genre or multiple genres
              if (text.includes(',')) {
                genres = text.split(',').map(g => g.trim()).slice(0, 3);
              } else {
                genres = [text];
              }
            }
          });

          const movieData = {
            "Movie score": rating,
            "Movie name": title,
            "Movie genre": genres
          };

          movieList.push(movieData);
        } catch (error) {
          console.error(`Error processing movie ${index + 1}:`, error);
        }
      });

      return movieList;
    });

    console.error(`Successfully extracted ${movies.length} movies`);
    return movies;

  } finally {
    await browser.close();
  }
}

async function main() {
  try {
    console.error('Fetching the top 250 rated movies from IMDb...');
    const movies = await getTop250Movies();

    // Output JSON to stdout
    console.log(JSON.stringify(movies, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
