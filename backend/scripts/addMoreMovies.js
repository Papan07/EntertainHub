import mongoose from 'mongoose';
import { Movie } from '../models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Additional diverse movies for a richer database
const additionalMovies = [
  {
    title: "The Lion King",
    originalTitle: "The Lion King",
    overview: "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows up beyond the Savannah, living by a philosophy: No worries for the rest of your days. But when his past comes to haunt him, the young prince must decide his fate: Will he remain an outcast or face his demons and become what he needs to be?",
    tagline: "Life's greatest adventure is finding your place in the Circle of Life.",
    releaseDate: new Date("1994-06-15"),
    status: "Released",
    posterPath: "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    backdropPath: "/hKGNkOan5W1MmM6iDxdkJk3Qz5P.jpg",
    voteAverage: 8.5,
    voteCount: 16000,
    popularity: 89.234,
    runtime: 88,
    budget: 45000000,
    revenue: 968483777,
    genres: [
      { id: 16, name: "Animation" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Walt Disney Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 8587
  },

  {
    title: "Toy Story",
    originalTitle: "Toy Story",
    overview: "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences.",
    tagline: "The adventure takes off!",
    releaseDate: new Date("1995-10-30"),
    status: "Released",
    posterPath: "/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    backdropPath: "/2JUVwSWl5ME5Tg2MNAYWmgOGnhA.jpg",
    voteAverage: 8.3,
    voteCount: 18000,
    popularity: 76.543,
    runtime: 81,
    budget: 30000000,
    revenue: 373554033,
    genres: [
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 10751, name: "Family" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Pixar Animation Studios", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 862
  },

  {
    title: "The Silence of the Lambs",
    originalTitle: "The Silence of the Lambs",
    overview: "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism. Crawford believes that Lecter may have insight into a case and that Starling, as an attractive young woman, may be just the bait to draw him out.",
    tagline: "To enter the mind of a killer she must challenge the mind of a madman.",
    releaseDate: new Date("1991-02-14"),
    status: "Released",
    posterPath: "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    backdropPath: "/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg",
    voteAverage: 8.6,
    voteCount: 14000,
    popularity: 67.890,
    runtime: 118,
    budget: 19000000,
    revenue: 272742922,
    genres: [
      { id: 80, name: "Crime" },
      { id: 18, name: "Drama" },
      { id: 53, name: "Thriller" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Orion Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 274
  },

  {
    title: "Goodfellas",
    originalTitle: "Goodfellas",
    overview: "The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.",
    tagline: "Three Decades of Life in the Mafia.",
    releaseDate: new Date("1990-09-12"),
    status: "Released",
    posterPath: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    backdropPath: "/sw7mordbZxgITU877yTpZCud90M.jpg",
    voteAverage: 8.7,
    voteCount: 12000,
    popularity: 78.456,
    runtime: 145,
    budget: 25000000,
    revenue: 46836394,
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Warner Bros. Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 769
  },

  {
    title: "Casablanca",
    originalTitle: "Casablanca",
    overview: "In Casablanca, Morocco in December 1941, a cynical American expatriate meets a former lover, with unforeseen complications.",
    tagline: "They had a date with fate in Casablanca!",
    releaseDate: new Date("1942-11-26"),
    status: "Released",
    posterPath: "/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    backdropPath: "/uyIaKP1N5AtXL8N8nGbBVyMva8X.jpg",
    voteAverage: 8.5,
    voteCount: 8000,
    popularity: 45.678,
    runtime: 102,
    budget: 1000000,
    revenue: 10800000,
    genres: [
      { id: 18, name: "Drama" },
      { id: 10749, name: "Romance" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Warner Bros. Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 289
  },

  {
    title: "Star Wars",
    originalTitle: "Star Wars",
    overview: "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
    tagline: "A long time ago in a galaxy far, far away...",
    releaseDate: new Date("1977-05-25"),
    status: "Released",
    posterPath: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    backdropPath: "/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg",
    voteAverage: 8.6,
    voteCount: 19000,
    popularity: 98.765,
    runtime: 121,
    budget: 11000000,
    revenue: 775398007,
    genres: [
      { id: 12, name: "Adventure" },
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Lucasfilm", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 11
  },

  {
    title: "E.T. the Extra-Terrestrial",
    originalTitle: "E.T. the Extra-Terrestrial",
    overview: "An alien is left behind on Earth and saved by the 10-year-old Elliot who decides to keep him hidden in his home. While a task force hunts for the extra-terrestrial, Elliot, his brother, and his little sister Gertie form an emotional bond with their new friend, and try to help him find his way home.",
    tagline: "He is afraid. He is alone. He is three million light years from home.",
    releaseDate: new Date("1982-06-11"),
    status: "Released",
    posterPath: "/5Jgp5VDGu6zBd8zKNlVNlpafzCR.jpg",
    backdropPath: "/8BPZO0Bf8TeAy8znF43z8soK3ys.jpg",
    voteAverage: 7.9,
    voteCount: 11000,
    popularity: 67.890,
    runtime: 115,
    budget: 10500000,
    revenue: 792965326,
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 10751, name: "Family" },
      { id: 18, name: "Drama" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Universal Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 601
  }
];

async function addMoreMovies() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainhub';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Insert additional movies (without clearing existing ones)
    const insertedMovies = await Movie.insertMany(additionalMovies);
    console.log(`✅ Added ${insertedMovies.length} additional movies`);

    // Get total count
    const totalMovies = await Movie.countDocuments();
    console.log(`📊 Total movies in database: ${totalMovies}`);

    console.log('\n🎬 Additional movies added:');
    insertedMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseDate.getFullYear()})`);
    });

    console.log('\n✅ Additional movies seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error adding movies:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
addMoreMovies();
