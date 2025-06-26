import mongoose from 'mongoose';
import { Movie } from '../models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sample movies data for testing
const sampleMovies = [
  {
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    tagline: "Welcome to a world without rules.",
    releaseDate: new Date("2008-07-18"),
    status: "Released",
    posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropPath: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    voteAverage: 9.0,
    voteCount: 32000,
    popularity: 123.456,
    runtime: 152,
    budget: 185000000,
    revenue: 1004558444,
    genres: [
      { id: 28, name: "Action" },
      { id: 80, name: "Crime" },
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
      { id: 1, name: "Warner Bros. Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 155
  },
  {
    title: "Inception",
    originalTitle: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
    tagline: "Your mind is the scene of the crime.",
    releaseDate: new Date("2010-07-16"),
    status: "Released",
    posterPath: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropPath: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    voteAverage: 8.8,
    voteCount: 35000,
    popularity: 98.765,
    runtime: 148,
    budget: 160000000,
    revenue: 836836967,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
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
      { id: 1, name: "Warner Bros. Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 27205
  },
  {
    title: "Interstellar",
    originalTitle: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    releaseDate: new Date("2014-11-07"),
    status: "Released",
    posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropPath: "/pbrkL804c8yAv3zBZR4QPWZAAn8.jpg",
    voteAverage: 8.6,
    voteCount: 33000,
    popularity: 87.432,
    runtime: 169,
    budget: 165000000,
    revenue: 701729206,
    genres: [
      { id: 18, name: "Drama" },
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
      { id: 1, name: "Paramount Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 157336
  },
  {
    title: "The Matrix",
    originalTitle: "The Matrix",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer programmer who is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
    tagline: "Welcome to the Real World.",
    releaseDate: new Date("1999-03-31"),
    status: "Released",
    posterPath: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropPath: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    voteAverage: 8.7,
    voteCount: 25000,
    popularity: 76.543,
    runtime: 136,
    budget: 63000000,
    revenue: 467222824,
    genres: [
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
      { id: 1, name: "Warner Bros. Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: false,
    trending: true,
    tmdbId: 603
  },
  {
    title: "Avengers: Endgame",
    originalTitle: "Avengers: Endgame",
    overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
    tagline: "Avenge the fallen.",
    releaseDate: new Date("2019-04-26"),
    status: "Released",
    posterPath: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdropPath: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    voteAverage: 8.3,
    voteCount: 28000,
    popularity: 134.567,
    runtime: 181,
    budget: 356000000,
    revenue: 2797800564,
    genres: [
      { id: 12, name: "Adventure" },
      { id: 878, name: "Science Fiction" },
      { id: 28, name: "Action" }
    ],
    originalLanguage: "en",
    spokenLanguages: [
      { iso_639_1: "en", name: "English" }
    ],
    productionCountries: [
      { iso_3166_1: "US", name: "United States of America" }
    ],
    productionCompanies: [
      { id: 1, name: "Marvel Studios", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 299534
  },
  {
    title: "Spider-Man: No Way Home",
    originalTitle: "Spider-Man: No Way Home",
    overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    tagline: "The Multiverse unleashed.",
    releaseDate: new Date("2021-12-17"),
    status: "Released",
    posterPath: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdropPath: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    voteAverage: 8.1,
    voteCount: 19000,
    popularity: 145.678,
    runtime: 148,
    budget: 200000000,
    revenue: 1921847111,
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
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
      { id: 1, name: "Sony Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: false,
    trending: true,
    tmdbId: 634649
  },

  // Additional Popular Movies
  {
    title: "Pulp Fiction",
    originalTitle: "Pulp Fiction",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    tagline: "Just because you are a character doesn't mean you have character.",
    releaseDate: new Date("1994-10-14"),
    status: "Released",
    posterPath: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropPath: "/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
    voteAverage: 8.9,
    voteCount: 27000,
    popularity: 89.234,
    runtime: 154,
    budget: 8000000,
    revenue: 214179088,
    genres: [
      { id: 80, name: "Crime" },
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
      { id: 1, name: "Miramax", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 680
  },

  {
    title: "Forrest Gump",
    originalTitle: "Forrest Gump",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
    tagline: "Life is like a box of chocolates... you never know what you're gonna get.",
    releaseDate: new Date("1994-07-06"),
    status: "Released",
    posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdropPath: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
    voteAverage: 8.8,
    voteCount: 26000,
    popularity: 78.456,
    runtime: 142,
    budget: 55000000,
    revenue: 677387716,
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
      { id: 1, name: "Paramount Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 13
  },

  {
    title: "The Godfather",
    originalTitle: "The Godfather",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    tagline: "An offer you can't refuse.",
    releaseDate: new Date("1972-03-14"),
    status: "Released",
    posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropPath: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    voteAverage: 9.2,
    voteCount: 19000,
    popularity: 92.345,
    runtime: 175,
    budget: 6000000,
    revenue: 245066411,
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
      { id: 1, name: "Paramount Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 238
  },

  {
    title: "Titanic",
    originalTitle: "Titanic",
    overview: "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship. Rose tells the whole story from Titanic's departure through to its death—on its first and last voyage—on April 15, 1912.",
    tagline: "Nothing on Earth could come between them.",
    releaseDate: new Date("1997-11-18"),
    status: "Released",
    posterPath: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    backdropPath: "/yDI6D5ZQh67YU4r2ms8qcSbAviZ.jpg",
    voteAverage: 7.9,
    voteCount: 23000,
    popularity: 95.678,
    runtime: 194,
    budget: 200000000,
    revenue: 2187463944,
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
      { id: 1, name: "20th Century Fox", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 597
  },

  {
    title: "The Shawshank Redemption",
    originalTitle: "The Shawshank Redemption",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    releaseDate: new Date("1994-09-23"),
    status: "Released",
    posterPath: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdropPath: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
    voteAverage: 9.3,
    voteCount: 26000,
    popularity: 88.234,
    runtime: 142,
    budget: 25000000,
    revenue: 16000000,
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
      { id: 1, name: "Castle Rock Entertainment", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 278
  },

  {
    title: "Avatar",
    originalTitle: "Avatar",
    overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    tagline: "Enter the World of Pandora.",
    releaseDate: new Date("2009-12-10"),
    status: "Released",
    posterPath: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    backdropPath: "/Yc9q6QuWrMp9nuDm5R8ExNqbEWU.jpg",
    voteAverage: 7.6,
    voteCount: 28000,
    popularity: 102.456,
    runtime: 162,
    budget: 237000000,
    revenue: 2923706026,
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
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
      { id: 1, name: "20th Century Fox", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 19995
  },

  {
    title: "Jurassic Park",
    originalTitle: "Jurassic Park",
    overview: "A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA. Before opening day, he invites a team of experts and his two eager grandchildren to experience the park and help calm anxious investors. However, the park is anything but amusing as the security systems go off-line and the dinosaurs escape.",
    tagline: "An adventure 65 million years in the making.",
    releaseDate: new Date("1993-06-11"),
    status: "Released",
    posterPath: "/b1AQhL5DrkWBMXiJcKHyuGAmTzD.jpg",
    backdropPath: "/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    voteAverage: 8.2,
    voteCount: 15000,
    popularity: 87.345,
    runtime: 127,
    budget: 63000000,
    revenue: 1029939903,
    genres: [
      { id: 12, name: "Adventure" },
      { id: 878, name: "Science Fiction" },
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
      { id: 1, name: "Universal Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: false,
    tmdbId: 329
  },

  {
    title: "Black Panther",
    originalTitle: "Black Panther",
    overview: "King T'Challa returns home to the reclusive, technologically advanced African nation of Wakanda to serve as his country's new leader. However, T'Challa soon finds that he is challenged for the throne by factions within his own country as well as without. Using powers reserved to Wakandan kings, T'Challa assumes the Black Panther mantle to join with ex-girlfriend Nakia, the queen-mother, his princess-kid-sister, members of the Dora Milaje (the Wakandan 'special forces') and an American secret agent, to prevent Wakanda from being dragged into a world war.",
    tagline: "Long live the king.",
    releaseDate: new Date("2018-02-13"),
    status: "Released",
    posterPath: "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    backdropPath: "/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg",
    voteAverage: 7.3,
    voteCount: 20000,
    popularity: 98.765,
    runtime: 134,
    budget: 200000000,
    revenue: 1347597973,
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
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
      { id: 1, name: "Marvel Studios", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 284054
  },

  {
    title: "Parasite",
    originalTitle: "기생충",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    tagline: "Act like you own the place.",
    releaseDate: new Date("2019-05-30"),
    status: "Released",
    posterPath: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdropPath: "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    voteAverage: 8.5,
    voteCount: 17000,
    popularity: 76.543,
    runtime: 132,
    budget: 11400000,
    revenue: 263540000,
    genres: [
      { id: 35, name: "Comedy" },
      { id: 53, name: "Thriller" },
      { id: 18, name: "Drama" }
    ],
    originalLanguage: "ko",
    spokenLanguages: [
      { iso_639_1: "ko", name: "Korean" }
    ],
    productionCountries: [
      { iso_3166_1: "KR", name: "South Korea" }
    ],
    productionCompanies: [
      { id: 1, name: "CJ Entertainment", logoPath: null, originCountry: "KR" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 496243
  },

  {
    title: "Dune",
    originalTitle: "Dune",
    overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence-a commodity capable of unlocking humanity's greatest potential-only those who can conquer their fear will survive.",
    tagline: "Dreams are messages from the deep.",
    releaseDate: new Date("2021-09-15"),
    status: "Released",
    posterPath: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdropPath: "/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
    voteAverage: 8.0,
    voteCount: 12000,
    popularity: 134.567,
    runtime: 155,
    budget: 165000000,
    revenue: 401771771,
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" }
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
    trending: true,
    tmdbId: 438631
  },

  {
    title: "Top Gun: Maverick",
    originalTitle: "Top Gun: Maverick",
    overview: "After more than thirty years of service as one of the Navy's top aviators, and dodging the advancement in rank that would ground him, Pete 'Maverick' Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
    tagline: "Feel the need... The need for speed.",
    releaseDate: new Date("2022-05-24"),
    status: "Released",
    posterPath: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdropPath: "/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    voteAverage: 8.3,
    voteCount: 9000,
    popularity: 156.789,
    runtime: 130,
    budget: 170000000,
    revenue: 1488732821,
    genres: [
      { id: 28, name: "Action" },
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
      { id: 1, name: "Paramount Pictures", logoPath: null, originCountry: "US" }
    ],
    adult: false,
    featured: true,
    trending: true,
    tmdbId: 361743
  }
];

async function seedMovies() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainhub';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');

    // Insert sample movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Inserted ${insertedMovies.length} sample movies`);

    // Create text indexes for search
    await Movie.collection.createIndex({ title: 'text', overview: 'text' });
    console.log('✅ Created text search indexes');

    console.log('\n🎬 Sample movies added:');
    insertedMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseDate.getFullYear()})`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
seedMovies();
