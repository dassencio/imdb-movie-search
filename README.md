# IMDb Movie Search

This repository provides a command-line tool (`ims`) for searching IMDb's movie
datasets by various criteria such as rating, year, duration, genre, and number
of votes.

## Description

When you run `ims` for the first time, it will automatically download and
preprocess the latest IMDb datasets from
[datasets.imdbws.com](https://datasets.imdbws.com). The preprocessing step
creates a clean, searchable database of movies (excluding TV shows, episodes,
etc.), with a focus on English-language titles for consistency.

**Note:** The initial download and processing may take several minutes,
depending on your internet speed and system performance.

## Usage instructions

To search for movies, simply run:

```bash
./ims [OPTIONS]
```

### Options

- `--min-duration NUM`: Minimum movie duration in minutes (default: `0`)
- `--max-duration NUM`: Maximum movie duration in minutes (default: unlimited)
- `--min-rating FLOAT`: Minimum average rating (`0.0`–`10.0`, default: `0.0`)
- `--max-rating FLOAT`: Maximum average rating (`0.0`–`10.0`, default: `10.0`)
- `--min-num-votes NUM`: Minimum number of votes (default: `0`)
- `--max-num-votes NUM`: Maximum number of votes (default: unlimited)
- `--min-year YEAR`: Minimum release year (default: `1888`)
- `--max-year YEAR`: Maximum release year (default: current year)
- `--genres LIST`: Comma-separated list of genres to include (default: all)
- `--output-format FORMAT`: Output format (`tsv` or `json`, default: `tsv`)
- `--refresh-datasets`: Force refresh of IMDb datasets
- `-h, --help`: Show help message and exit

### Available genres

The `--genres` option accepts any of the following:

    Action, Adult, Adventure, Animation, Biography, Comedy, Crime, Documentary,
    Drama, Family, Fantasy, Film-Noir, Game-Show, History, Horror, Music,
    Musical, Mystery, News, Reality-TV, Romance, Sci-Fi, Short, Sport,
    Talk-Show, Thriller, War, Western

## Examples

**Highly rated action movies from the 2000s:**

```bash
./ims --min-rating 7.0 --min-year 2000 --max-year 2009 --genres Action --min-num-votes 100000
```

**Recent comedies under 2 hours (JSON output):**

```bash
./ims --min-year 2025 --max-duration 120 --genres Comedy --output-format json
```

**Top-rated classics with strong vote counts:**

```bash
./ims --max-year 1980 --min-num-votes 50000 --min-rating 8.0
```

**Epic long-form dramas/adventures:**

```bash
./ims --min-duration 180 --genres Drama,Adventure,War --min-rating 7.5
```

**Tip:** Using `--min-num-votes` helps filter out less known movies, leaving
only well-regarded titles.

## Output formats

### TSV (default)

By default, results are saved as a TSV (tab-separated values) file named
`movies.tsv` with these columns:

- `id`: IMDb title identifier (e.g., `tt1234567`)
- `title`: Movie title
- `duration`: Duration in minutes
- `rating`: Average rating (`0.0`–`10.0`)
- `num_votes`: Number of votes
- `year`: Release year
- `genres`: Genres separated by ` / `

### JSON

When `--output-format json` is used, results are written as a structured JSON
array. Each movie object contains the same fields as above.

## Updating the dataset

IMDb updates its datasets regularly. To refresh the local copies of the
datasets, run:

```bash
./fetch-imdb-datasets
```

Alternatively, add the `--refresh-datasets` flag when running `ims`:

```bash
./ims [OPTIONS] --refresh-datasets
```

## Exploring results with VisiData

If you're in a GitHub Codespace or VS Code devcontainer, you can explore results
interactively with [VisiData](https://visidata.org/):

```bash
vd movies.tsv
```

For JSON output, run:

```bash
vd movies.json
```

To install VisiData locally, run:

```bash
pip install visidata
```

### Helpful VisiData shortcuts

- <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>←</kbd> / <kbd>→</kbd>: Move cursor
- <kbd>/</kbd>: Search
- <kbd>g g</kbd>: Jump to first row
- <kbd>G</kbd>: Jump to last row
- <kbd>g _</kbd>: Toggle column widths
- <kbd>q</kbd>: Quit

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

IMDb datasets are provided by IMDb and subject to their own terms of service.
Please review
[IMDb's data usage terms](https://help.imdb.com/article/imdb/general-information/can-i-use-imdb-data-in-my-software/G5JTRESSHJBBHTGX)
for more information.
