# IMDb Movie Search

This repository contains a command-line tool (`ims`) for searching and filtering
movies from the IMDb datasets. This tool downloads, processes, and provides a
flexible interface to query the IMDb movie database with various criteria such
as rating, year, duration, genre, and number of votes.

## Description

On the first time you execute `ims`, it will automatically download and
preprocess the latest IMDb datasets from
[datasets.imdbws.com](https://datasets.imdbws.com). The datasets are initially
processed to create a clean, searchable database of movies (excluding TV series,
episodes etc.) and focuses on English titles to provide a consistent and
searchable database.

**Note**: The download and processing may take several minutes depending on your
internet connection and system performance.

## Usage instructions

To search for movies matching certain criteria, simply use the `ims` tool:

```bash
./ims [OPTIONS]
```

#### Available options

- `--min-duration NUM`: Minimum movie duration in minutes (default: `0`)
- `--max-duration NUM`: Maximum movie duration in minutes (default: `unlimited`)
- `--min-rating FLOAT`: Minimum average rating (`0.0` - `10.0`, default: `0.0`)
- `--max-rating FLOAT`: Maximum average rating (`0.0` - `10.0`, default: `10.0`)
- `--min-num-votes NUM`: Minimum number of votes (default: `0`)
- `--max-num-votes NUM`: Maximum number of votes (default: `unlimited`)
- `--min-year YEAR`: Minimum release year (default: `1888`)
- `--max-year YEAR`: Maximum release year (default: current year)
- `--genres LIST`: Comma-separated list of genres to include (default: all
  genres)
- `--output-format FORMAT`: Output format - `tsv` or `json` (default: `tsv`)
- `--refresh-datasets`: Force refresh of IMDb datasets
- `-h, --help`: Show help message and exit

#### Available genres

The following genres can be used with the `--genres` option:

  Action, Adult, Adventure, Animation, Biography, Comedy, Crime, Documentary,
  Drama, Family, Fantasy, Film-Noir, Game-Show, History, Horror, Music, Musical,
  Mystery, News, Reality-TV, Romance, Sci-Fi, Short, Sport, Talk-Show, Thriller,
  War, Western

### Usage examples

**Find highly-rated action movies from the 2000s:**

```bash
./ims --min-rating 7.0 --min-year 2000 --max-year 2009 --genres Action --min-num-votes 100000
```

**Find recent comedy movies under 2 hours:**

```bash
./ims --min-year 2025 --max-duration 120 --genres Comedy --output-format json
```

**Find top-rated movies with high vote counts:**

```bash
./ims --max-year 1980 --min-num-votes 50000 --min-rating 8.0
```

**Find long epic movies:**

```bash
./ims --min-duration 180 --genres Drama,Adventure,War --min-rating 7.5
```

Using `--min-num-votes` allows you to filter out movies with low popularity,
ensuring you get well-regarded titles instead of a long list full of less-known
ones.

### Output formats

#### TSV output (default)

By default, the output is a TSV (tab-separated values) file named `movies.tsv`
with the following columns:

- `id`: IMDb title identifier (e.g., `tt1234567`)
- `title`: Movie title
- `duration`: Duration in minutes
- `rating`: Average rating (`0.0` - `10.0`)
- `num_votes`: Number of votes
- `year`: Release year
- `genres`: Genres separated by ` / `

#### JSON output

Structured JSON array with movie objects containing the same fields as the
columns from the TSV format.

### Updating the movie datasets

IMDb datasets are updated regularly. To get the latest version, you can run the
following command:

```bash
./fetch-imdb-datasets
```

Alternatively, add the `--refresh-datasets` flag to your `ims` command to force
a dataset refresh:

```bash
./ims --refresh-datasets ...
```

### Visualizing results with VisiData

If you're working in a GitHub Codespace or VS Code devcontainer, you can use
[VisiData](https://visidata.org/) to explore the generated file interactively
by running:

```bash
vd movies.tsv
```

or, in the case of JSON output:

```bash
vd movies.json
```

To install and use VisiData locally, open a terminal and run:

```bash
pip install visidata
```

Below are some helpful navigation controls:

- <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>←</kbd> / <kbd>→</kbd>: Move cursor
- <kbd>/</kbd>: Search
- <kbd>g g</kbd>: Go to the first row
- <kbd>G</kbd>: Go to the last row
- <kbd>g _</kbd>: Toggle width of all visible columns between full and default
  width
- <kbd>q</kbd>: Quit

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

The IMDb datasets used by this tool are provided by IMDb and are subject to
their own terms of service. Please refer to
[IMDb's data usage terms](https://help.imdb.com/article/imdb/general-information/can-i-use-imdb-data-in-my-software/G5JTRESSHJBBHTGX)
for more information.
