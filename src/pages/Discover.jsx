import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { HeartIcon, BookOpenIcon } from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

/* 🎨 Mood Themes */
const MOOD_THEMES = {
  happy: "from-yellow-100 via-pink-100 to-orange-200",
  sad: "from-blue-100 via-indigo-100 to-purple-200",
  neutral: "from-gray-100 via-slate-100 to-purple-100",
  anxious: "from-teal-100 via-cyan-100 to-blue-200",
  tired: "from-purple-100 via-indigo-100 to-slate-200",
  calm: "from-sky-100 via-blue-100 to-teal-200",
  grateful: "from-amber-100 via-orange-100 to-yellow-200",
  excited: "from-pink-200 via-purple-200 to-fuchsia-300",
  stressed: "from-cyan-100 via-sky-100 to-slate-200",
  lonely: "from-indigo-100 via-purple-100 to-slate-200",
  confident: "from-emerald-100 via-green-100 to-lime-200",
  overwhelmed: "from-rose-100 via-pink-100 to-purple-200",
  focused: "from-slate-100 via-gray-100 to-blue-200",
};

/* 🎧🎬📚 FULL RECOMMENDATIONS */
const RECOMMENDATIONS = {
  happy: {
    songs: [
      { title: "Happy – Pharrell Williams", link: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH" },
      { title: "Good as Hell – Lizzo", link: "https://open.spotify.com/track/6KgBpzTuTRPebChN0VTyzV" },
      { title: "Ilahi – Arijit Singh", link: "https://open.spotify.com/track/0VxgNsSywsjapKGXvzj8RH" },
      { title: "Love You Zindagi – Jasleen Royal & Amit Trivedi", link: "https://open.spotify.com/track/6k3XXCE1ZzwevQlxf8dNaw" },
      { title: "Sunday Best – Surfaces", link: "https://open.spotify.com/track/1qYKWcEOrh2tM8PlgIm8K1" },
      { title: "Walking on Sunshine – Katrina & The Waves", link: "https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0" },
      { title: "On Top of the World – Imagine Dragons", link: "https://open.spotify.com/track/6KuHjfXHkfnIjdmcIvt9r0" },
      { title: "Gallan Goodiyaan – Various Artists", link: "https://open.spotify.com/track/7hNYvX0qAKrxtVr1jGDmvR" },
      { title: "Can't Stop the Feeling – Justin Timberlake", link: "https://open.spotify.com/track/6JV2JOEocMgcZxYSZelKcc" },
      { title: "Aaj Kal Zindagi – Shankar Mahadevan", link: "https://open.spotify.com/track/0P5Zy0LgYGHCAO4WUwSesk" }
    ],
    movies: [
      { title: "Zindagi Na Milegi Dobara", link: "https://www.imdb.com/title/tt1562872/" },
      { title: "Yeh Jawaani Hai Deewani", link: "https://www.imdb.com/title/tt2178470/" },
      { title: "Paddington 2", link: "https://www.imdb.com/title/tt4468740/" },
      { title: "Little Miss Sunshine", link: "https://www.imdb.com/title/tt0449059/" },
      { title: "The Intern", link: "https://www.imdb.com/title/tt2361509/" },
      { title: "Sing Is Kinng", link: "https://www.imdb.com/title/tt1185418/" },
      { title: "The Grand Budapest Hotel", link: "https://www.imdb.com/title/tt2278388/" },
      { title: "Queen", link: "https://www.imdb.com/title/tt3322420/" },
    ],
    books: [
      { title: "The House in the Cerulean Sea – TJ Klune", link: "https://www.goodreads.com/book/show/45047384-the-house-in-the-cerulean-sea" },
      { title: "The Alchemist – Paulo Coelho", link: "https://www.goodreads.com/book/show/18144590-the-alchemist" },
      { title: "Red, White & Royal Blue – Casey McQuiston", link: "https://www.goodreads.com/book/show/41150487-red-white-royal-blue" }
    ]
  },
  sad: {
    songs: [
      { title: "Fix You – Coldplay", link: "https://open.spotify.com/track/7LVHVU3tWfcxj5aiPFEW4Q" },
      { title: "Someone Like You – Adele", link: "https://open.spotify.com/track/4kflIGfjdZJW4ot2ioixTB" },
      { title: "Agar Tum Saath Ho – Alka Yagnik & Arijit Singh", link: "https://open.spotify.com/track/3hkC9EHFZNQPXrtl8WPHnX" },
      { title: "Channa Mereya – Arijit Singh", link: "https://open.spotify.com/track/0H2iJVgorRR0ZFgRqGUjUM" },
      { title: "Liability – Lorde", link: "https://open.spotify.com/track/6Kkt27YmFyIFrcX3QXFi2o" },
      { title: "All I Want – Kodaline", link: "https://open.spotify.com/track/0NlGoUyOJSuSHmngoibVAs" },
      { title: "Ranjha – B Praak & Jasleen Royal", link: "https://open.spotify.com/track/72zHuDxFQTjbL51qJQSA7j" },
      { title: "The Night We Met – Lord Huron", link: "https://open.spotify.com/track/3hRV0jL3vUpRrcy398teAU" },
      { title: "Hurt – Johnny Cash", link: "https://open.spotify.com/track/28cnXtME493VX9NOw9cIUh" },
      { title: "Jeena Jeena – Atif Aslam", link: "https://open.spotify.com/track/5lKE040hUfDAKOR8HLG92p" }
    ],
    movies: [
      { title: "Rockstar", link: "https://www.imdb.com/title/tt1839596/" },
      { title: "Tamasha", link: "https://www.imdb.com/title/tt3148502/" },
      { title: "Her", link: "https://www.imdb.com/title/tt1798709/" },
      { title: "Blue Valentine", link: "https://www.imdb.com/title/tt1120985/" },
      { title: "Manchester by the Sea", link: "https://www.imdb.com/title/tt4034228/" },
      { title: "Schindler's List", link: "https://www.imdb.com/title/tt0108052/" },
      { title: "Grave of the Fireflies", link: "https://www.imdb.com/title/tt0095241/" },
      { title: "The Fault in Our Stars", link: "https://www.imdb.com/title/tt2582846/" },
    ],
    books: [
      { title: "A Little Life – Hanya Yanagihara", link: "https://www.goodreads.com/book/show/22822858-a-little-life" },
      { title: "The Book Thief – Markus Zusak", link: "https://www.goodreads.com/book/show/19063.The_Book_Thief" },
      { title: "Norwegian Wood – Haruki Murakami", link: "https://www.goodreads.com/book/show/11297.Norwegian_Wood" }
    ]
  },
  neutral: {
    songs: [
      { title: "Pink + White – Frank Ocean", link: "https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8" },
      { title: "Location Unknown – HONNE", link: "https://open.spotify.com/track/6A1GBCMwbfhkB9e1thR8a8" },
      { title: "Kasoor – Prateek Kuhad", link: "https://open.spotify.com/track/08kTa3SL9sV6Iy8KLKtGql" },
      { title: "Youth – Daughter", link: "https://open.spotify.com/track/2Ck6gblyk3UFCVPTh8o3TN" },
      { title: "Alag Aasmaan – Anuv Jain", link: "https://open.spotify.com/track/3bQsp4Vr9Rg4fNCx6HPOgX" },
      { title: "Cherry – Harry Styles", link: "https://open.spotify.com/track/2IOFZdYYkFxEHVz1w34PoL" },
      { title: "Moon Song – Phoebe Bridgers", link: "https://open.spotify.com/track/46RNrAkGsqWTDrv2ZPOAbx" },
      { title: "Cold Little Heart – Michael Kiwanuka", link: "https://open.spotify.com/track/0qprlw0jfsW4H9cG0FFE0Z" },
      { title: "Let Her Go – Passenger", link: "https://open.spotify.com/track/2pUpNOgJBIBCcjyQZQ00qUo" },
      { title: "Iktara – Amit Trivedi & Kavita Seth", link: "https://open.spotify.com/track/0RJ7HhnQxJEOpGC5Htmez4" }
    ],
    movies: [
      { title: "Before Sunrise", link: "https://www.imdb.com/title/tt0112471/" },
      { title: "Lost in Translation", link: "https://www.imdb.com/title/tt0335266/" },
      { title: "The Lunchbox", link: "https://www.imdb.com/title/tt2350496/" },
      { title: "Paterson", link: "https://www.imdb.com/title/tt5247022/" },
      { title: "Nomadland", link: "https://www.imdb.com/title/tt9770150/" },
      { title: "The Florida Project", link: "https://www.imdb.com/title/tt5649144/" },
      { title: "Piku", link: "https://www.imdb.com/title/tt3691740/" },
      { title: "Columbus", link: "https://www.imdb.com/title/tt5990474/" },
    ],
    books: [
  { "title": "The Midnight Library – Matt Haig", "link": "https://www.goodreads.com/book/show/52578297-the-midnight-library" },
  { "title": "Convenience Store Woman – Sayaka Murata", "link": "https://www.goodreads.com/book/show/38357895-convenience-store-woman" },
  { "title": "A Man Called Ove – Fredrik Backman", "link": "https://www.goodreads.com/book/show/18774964-a-man-called-ove" }
]
  },
  anxious: {
    songs: [
      { title: "Weightless – Marconi Union", link: "https://open.spotify.com/track/3LKOq8Tsv3ufu8t1LLQf9Y" },
      { title: "Holocene – Bon Iver", link: "https://open.spotify.com/track/4fbvXwMTXPWaFyaMWUm9CR" },
      { title: "Breathe Me – Sia", link: "https://open.spotify.com/track/6KUY5wJCNvoB2JbXUJbHeW" },
      { title: "Kho Gaye Hum Kahan – Jasleen Royal", link: "https://open.spotify.com/track/7nPCAO0Q9AHbM7PWyj9O98" },
      { title: "River – Leon Bridges", link: "https://open.spotify.com/track/3hhbDnFUb2bicI2df6VurK" },
      { title: "Motion Picture Soundtrack – Radiohead", link: "https://open.spotify.com/track/4SrRrB27n7fiRkQcPoKfpk" },
      { title: "Fix You (Live) – Coldplay", link: "https://open.spotify.com/track/7FFi0otsNY4pkenhwKahDf" },
      { title: "Liability – Lorde", link: "https://open.spotify.com/track/6Kkt27YmFyIFrcX3QXFi2o" },
      { title: "Nadaan Parindey – A.R.Rahman", link: "https://open.spotify.com/track/6Z394Nd4gW6Ts9hmu3NUjx" },
      { title: "Je Te Laisserai Des Mots – Patrick Watson", link: "https://open.spotify.com/track/44A0o4jA8F2ZF03Zacwlwx" }
    ],
    movies: [
      { title: "Dear Zindagi", link: "https://www.imdb.com/title/tt5946128/" },
      { title: "Inside Out", link: "https://www.imdb.com/title/tt2096673/" },
      { title: "Little Forest", link: "https://www.imdb.com/title/tt3474600/" },
      { title: "Perks of Being a Wallflower", link: "https://www.imdb.com/title/tt1659337/" },
      { title: "My Neighbor Totoro", link: "https://www.imdb.com/title/tt0095647/" },
      { title: "Amélie", link: "https://www.imdb.com/title/tt0211915/" },
      { title: "Udaan", link: "https://www.imdb.com/title/tt1632948/" },
      { title: "Good Will Hunting", link: "https://www.imdb.com/title/tt0119217/" },
    ],
    books: [
  { "title": "First, We Make the Beast Beautiful – Sarah Wilson", "link": "https://www.goodreads.com/book/show/34210334-first-we-make-the-beast-beautiful" },
  { "title": "Notes on a Nervous Planet – Matt Haig", "link": "https://www.goodreads.com/book/show/37797266-notes-on-a-nervous-planet" },
  { "title": "Phosphorescence – Julia Baird", "link": "https://www.goodreads.com/book/show/51017730-phosphorescence" }
]
  },
  tired: {
    songs: [
      { title: "Sunrise – Norah Jones", link: "https://open.spotify.com/track/7zkLpY72g6lKQbiHDqri1S" },
      { title: "Stay Awake – London Grammar", link: "https://open.spotify.com/track/0rQDukE3ClP65YWJMQTGRd" },
      { title: "Der Lagi Lekin – Shankar Mahadevan", link: "https://open.spotify.com/track/78HEXs4YB5SE9JgTHOUdDw" },
      { title: "Nightcall – London Grammar", link: "https://open.spotify.com/track/2nh7EgCBZOQD4dbeWRK1VO" },
      { title: "I'm So Tired – Lauv & Troye Sivan", link: "https://open.spotify.com/track/7COXchtUOMd6uIT6HvmRaI" },
      { title: "Khaabon Ke Parinday – Shankar-Ehsaan-Loy, Alyssa Mendonsa, Mohit Chauhan", link: "https://open.spotify.com/track/1yF2XFNhBmbFd2HdblAK0g" },
      { title: "Banana Pancakes – Jack Johnson", link: "https://open.spotify.com/track/0BgbobvykXxEvxo2HhCuvM" },
      { title: "Slow Burn – Kacey Musgraves", link: "https://open.spotify.com/track/6ET9kf9riLETWs9lePUEAI" },
      { title: "Aa Chal Ke Tujhe – Kishore Kumar", link: "https://open.spotify.com/track/6yFbHMY5F1jpT54ZiH4Rkk" },
      { title: "Coffee – Miguel", link: "https://open.spotify.com/track/6vMpPxLV0F5Diwcs6awI1Z" }
    ],
    movies: [
      { title: "Karwaan", link: "https://www.imdb.com/title/tt8104752/" },
      { title: "Chef", link: "https://www.imdb.com/title/tt2885172/" },
      { title: "The Secret Life of Walter Mitty", link: "https://www.imdb.com/title/tt0359950/" },
      { title: "Spirited Away", link: "https://www.imdb.com/title/tt0245429/" },
      { title: "Wake Up Sid", link: "https://www.imdb.com/title/tt1327194/" },
      { title: "A Ghost Story", link: "https://www.imdb.com/title/tt6265828/" },
      { title: "Raincoat", link: "https://www.imdb.com/title/tt0418104/" },
      { title: "The Holiday", link: "https://www.imdb.com/title/tt0457495/" },
    ],
    books: [
  { "title": "The Ocean at the End of the Lane – Neil Gaiman", "link": "https://www.goodreads.com/book/show/15783514-the-ocean-at-the-end-of-the-lane" },
  { "title": "Slowness – Milan Kundera", "link": "https://www.goodreads.com/book/show/26097.Slowness" },
  { "title": "How to Do Nothing – Jenny Odell", "link": "https://www.goodreads.com/book/show/42771901-how-to-do-nothing" }
]
  },
  calm: {
    songs: [
      { title: "River Flows in You – Yiruma", link: "https://open.spotify.com/track/7fnqltLx83HsYLQajzCYRk" },
      { title: "Moh Moh Ke Dhaage – Papon & Monali Thakur", link: "https://open.spotify.com/track/5IGQmG1m4Hz0OnD4oxALta" },
      { title: "Landslide – Fleetwood Mac", link: "https://open.spotify.com/track/5ihS6UUlyQAfmp48eSkxuQ" },
      { title: "Raataan Lambiyan (Lofi Flip) – VIBIE", link: "https://open.spotify.com/track/47GoImoZiTI32p1t4H4b7h" },
      { title: "Better Together – Jack Johnson", link: "https://open.spotify.com/track/2iXdwVdzA0KrI2Q0iZNJbX" },
      { title: "Tease Me – Chaka Demus", link: "https://open.spotify.com/track/6Q7vgiFhulRp5cK7sDbjqa" },
      { title: "Only Time – Enya", link: "https://open.spotify.com/track/6FLwmdmW77N1Pxb1aWsZmO" },
      { title: "Ocean Eyes – Billie Eilish", link: "https://open.spotify.com/track/7hDVYcQq6MxkdJGweuCtl9" },
      { title: "Iktara (Male) – Amit Trivedi & Kavita Seth", link: "https://open.spotify.com/track/0RJ7HhnQxJEOpGC5Htmez4" },
      { title: "Coming Home – Leon Bridges", link: "https://open.spotify.com/track/65GbQI9VDTs7vo6MJL2iJA" }
    ],
    movies: [
      { title: "October", link: "https://www.imdb.com/title/tt7351600/" },
      { title: "Portrait of a Lady on Fire", link: "https://www.imdb.com/title/tt8613070/" },
      { title: "The Big Blue", link: "https://www.imdb.com/title/tt0095250/" },
      { title: "Masaan", link: "https://www.imdb.com/title/tt4016782/" },
      { title: "C'mon C'mon", link: "https://www.imdb.com/title/tt10986410/" },
      { title: "Life of Pi", link: "https://www.imdb.com/title/tt0454876/" },
      { title: "Call Me By Your Name", link: "https://www.imdb.com/title/tt5288312/" },
      { title: "Ship of Theseus", link: "https://www.imdb.com/title/tt1773764/" },
    ],
    books: [
  { "title": "Siddhartha – Hermann Hesse", "link": "https://www.goodreads.com/book/show/52036.Siddhartha" },
  { "title": "Braiding Sweetgrass – Robin Wall Kimmerer", "link": "https://www.goodreads.com/book/show/17465709-braiding-sweetgrass" },
  { "title": "The Art of Purring – David Michie", "link": "https://www.goodreads.com/book/show/15714080-the-art-of-purring" }
]
  },
  grateful: {
    songs: [
      { title: "Thank You – Dido", link: "https://open.spotify.com/track/3yUcJwYu7fXAfqMj9krY6l" },
      { title: "Shukran Allah – Salim–Sulaiman, Sonu Nigam, Shreya Ghoshal", link: "https://open.spotify.com/track/3nKEiJUeaWn8q2O9I1xwlB" },
      { title: "What a Wonderful World – Louis Armstrong", link: "https://open.spotify.com/track/29U7stRjqHU6rMiS8BfaI9" },
      { title: "Yun Hi Chala Chal – Udit Narayan, Hariharan, Kailash Kher", link: "https://open.spotify.com/track/3GrTI5vAoDD3VE24VTBJAc" },
      { title: "Gratitude – Brandon Lake", link: "https://open.spotify.com/track/4VI7berVSzuaBt1BGrBksC" },
      { title: "Lucky – Jason Mraz & Colbie Caillat", link: "https://open.spotify.com/track/0IktbUcnAGrvD03AWnz3Q8" },
      { title: "Teri Dastaan – AJasleen Royal", link: "https://open.spotify.com/track/0LbP2VQncT9J8ac3psAH2w" },
      { title: "Blessings – Big Sean", link: "https://open.spotify.com/track/1bzM1cd6oqFozdr4wK6HdR" },
      { title: "Unstoppable – Sia", link: "https://open.spotify.com/track/1yvMUkIOTeUNtNWlWRgANS" },
      { title: "Phir Se Ud Chala – Mohit Chauhan", link: "https://open.spotify.com/track/1kcV2LJxt5v0s2cEGtEJ5i" }
    ],
    movies: [
      { title: "The Pursuit of Happyness", link: "https://www.imdb.com/title/tt0454921/" },
      { title: "English Vinglish", link: "https://www.imdb.com/title/tt2181931/" },
      { title: "About Time", link: "https://www.imdb.com/title/tt2194499/" },
      { title: "Lion", link: "https://www.imdb.com/title/tt3741834/" },
      { title: "Life is Beautiful", link: "https://www.imdb.com/title/tt0118799/" },
      { title: "Super 30", link: "https://www.imdb.com/title/tt7484222/" },
      { title: "Wonder", link: "https://www.imdb.com/title/tt2543472/" },
      { title: "Iqbal", link: "https://www.imdb.com/title/tt0475293/" },
    ],
    books: [
  { "title": "The Book of Delights – Ross Gay", "link": "https://www.goodreads.com/book/show/38746152-the-book-of-delights" },
  { "title": "Gratitude – Oliver Sacks", "link": "https://www.goodreads.com/book/show/26114175-gratitude" },
  { "title": "The Little Book of Hygge – Meik Wiking", "link": "https://www.goodreads.com/book/show/30045634-the-little-book-of-hygge" }
]
  },
  excited: {
    songs: [
      { title: "Uptown Funk – Mark Ronson ft. Bruno Mars", link: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS" },
      { title: "Kar Gayi Chull – Badshah, Neha Kakkar", link: "https://open.spotify.com/track/3BhjbaGeI7E0CiIjctfdD3H" },
      { title: "Shut Up and Dance – WALK THE MOON", link: "https://open.spotify.com/track/4kbj5MwxO1bq9wjT5g9HaA" },
      { title: "Mauja Hi Mauja – Mika Singh", link: "https://open.spotify.com/track/2iXVckhPy7tP0wV9DvlrjZ" },
      { title: "Don't Stop Me Now – Queen", link: "https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i" },
      { title: "Levitating – Dua Lipa", link: "https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9" },
      { title: "Aankh Marey – Neha Kakkar, Mika Singh, Kumar Sanu", link: "https://open.spotify.com/track/63MvWd6T6yoS7h4AJ4Hjrm" },
      { title: "Blinding Lights – The Weeknd", link: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b" },
      { title: "London Thumakda – Labh Janjua, Sonu Kakkar, Neha Kakkar", link: "https://open.spotify.com/track/2qJAzSE6uC94oH2NRoPrGl" },
      { title: "Can't Hold Us – Macklemore & Ryan Lewis", link: "https://open.spotify.com/track/3bidbhpOYeV4knp8AIu8Xn" }
    ],
    movies: [
      { title: "Mad Max: Fury Road", link: "https://www.imdb.com/title/tt1392190/" },
      { title: "Dil Chahta Hai", link: "https://www.imdb.com/title/tt0292490/" },
      { title: "Baby Driver", link: "https://www.imdb.com/title/tt3890160/" },
      { title: "Top Gun: Maverick", link: "https://www.imdb.com/title/tt1745960/" },
      { title: "War", link: "https://www.imdb.com/title/tt7430722/" },
      { title: "Inception", link: "https://www.imdb.com/title/tt1375666/" },
      { title: "John Wick", link: "https://www.imdb.com/title/tt3450900/" },
      { title: "Bahubali: The Beginning", link: "https://www.imdb.com/title/tt2631186/" },
    ],
    books: [
  { "title": "Project Hail Mary – Andy Weir", "link": "https://www.goodreads.com/book/show/54493401-project-hail-mary" },
  { "title": "The Seven Husbands of Evelyn Hugo – Taylor Jenkins Reid", "link": "https://www.goodreads.com/book/show/32620332-the-seven-husbands-of-evelyn-hugo" },
  { "title": "Dark Matter – Blake Crouch", "link": "https://www.goodreads.com/book/show/27833670-dark-matter" }
]
  },
  stressed: {
    songs: [
      { title: "Kun Faya Kun – A.R. Rahman, Javed Ali, Mohit Chauhan", link: "https://open.spotify.com/track/7F8RNvTQlvbeBLeenycvN6" },
      { title: "Vienna – Billy Joel", link: "https://open.spotify.com/track/4U45aEWtQhrm8A5mxPaFZ7" },
      { title: "Strawberry Swing – Coldplay", link: "https://open.spotify.com/track/2dphvmoLEXdk8hOYxmHlI3" },
      { title: "Aashiyan – Shreya Ghoshal & Nikhil Paul George", link: "https://open.spotify.com/track/7ttlemwytO21npSmLKqTBg" },
      { title: "Let It Be – The Beatles", link: "https://open.spotify.com/track/7iN1s7xHE4ifF5povM6A48" },
      { title: "Phir Le Aaya Dil – Arijit Singh", link: "https://open.spotify.com/track/2OvldWM8rVnp7QCn9eCrr1" },
      { title: "breathin – Ariana Grande", link: "https://open.spotify.com/track/4OafepJy2teCjYJbvFE60J" },
      { title: "Safe and Sound – Taylor Swift & The Civil Wars", link: "https://open.spotify.com/track/2RJnNdu4pb3MypbBroHU0T" },
      { title: "Rehna Tu – A.R. Rahman, Prasun Joshi", link: "https://open.spotify.com/track/5RZbS87YI2wd87SWuO0YAX" },
      { title: "Holocene – Bon Iver", link: "https://open.spotify.com/track/4fbvXwMTXPWaFyaMWUm9CR" }
    ],
    movies: [
      { title: "Soul", link: "https://www.imdb.com/title/tt2948372/" },
      { title: "Dil Dhadakne Do", link: "https://www.imdb.com/title/tt3538702/" },
      { title: "Eighth Grade", link: "https://www.imdb.com/title/tt7014006/" },
      { title: "The Way Way Back", link: "https://www.imdb.com/title/tt1727388/" },
      { title: "Kapoor & Sons", link: "https://www.imdb.com/title/tt4639434/" },
      { title: "The Martian", link: "https://www.imdb.com/title/tt3659388/" },
      { title: "Office Space", link: "https://www.imdb.com/title/tt0151804/" },
      { title: "Chhichhore", link: "https://www.imdb.com/title/tt9130588/" },
    ],
    books: [
  { "title": "Reasons to Stay Alive – Matt Haig", "link": "https://www.goodreads.com/book/show/25733573-reasons-to-stay-alive" },
  { "title": "The Things You Can See Only When You Slow Down – Haemin Sunim", "link": "https://www.goodreads.com/book/show/30780006-the-things-you-can-see-only-when-you-slow-down" },
  { "title": "Maybe You Should Talk to Someone – Lori Gottlieb", "link": "https://www.goodreads.com/book/show/37570546-maybe-you-should-talk-to-someone" }
]
  },
  lonely: {
    songs: [
      { title: "Space Oddity – David Bowie", link: "https://open.spotify.com/track/4v7DCN09hgXkKazefkznDQ" },
      { title: "Tujhe Bhula Diya – Mohit Chauhan, Shekhar Ravjiani, Shruti Pathak", link: "https://open.spotify.com/track/4r8JqkhpTb5tzSKKHnVJIJ" },
      { title: "Lonely – Akon", link: "https://open.spotify.com/track/5nNmj1cLH3r4aA4XDJ2bgY" },
      { title: "Beete Lamhein – K.K.", link: "https://open.spotify.com/track/0zQa7QXLpUZfrrsWbgDZll" },
      { title: "Boulevard of Broken Dreams – Green Day", link: "https://open.spotify.com/track/5GorCbAP4aL0EJ16frG2hd" },
      { title: "Alone Again – Gilbert O’Sullivan", link: "https://open.spotify.com/track/54pvEYFocTlvIAQOfXSjqV" },
      { title: "Kabira – Arijit Singh & Harshdeep Kaur", link: "https://open.spotify.com/track/4bD9z9qa4qg9BhryvYWB7c" },
      { title: "Pictures of You – The Cure", link: "https://open.spotify.com/track/2o49Twc3qrNMOt8gq9W06L" },
      { title: "Jag Ghoomeya – Rahat Fateh Ali Khan", link: "https://open.spotify.com/track/4KCbZcshgibfJSCAkg87Lv" },
      { title: "The Sound of Silence – Simon & Garfunkel", link: "https://open.spotify.com/track/3YfS47QufnLDFA71FUsgCM" }
    ],
    movies: [
      { title: "Cast Away", link: "https://www.imdb.com/title/tt0162222/" },
      { title: "Into the Wild", link: "https://www.imdb.com/title/tt0758758/" },
      { title: "Moonlight", link: "https://www.imdb.com/title/tt4975722/" },
      { title: "Her", link: "https://www.imdb.com/title/tt1798709/" },
      { title: "October", link: "https://www.imdb.com/title/tt7351600/" },
      { title: "Lars and the Real Girl", link: "https://www.imdb.com/title/tt0805564/" },
      { title: "Wild", link: "https://www.imdb.com/title/tt2305051/" },
      { title: "Udaan", link: "https://www.imdb.com/title/tt1632948/" },
    ],
    books: [
  { "title": "Eleanor Oliphant Is Completely Fine – Gail Honeyman", "link": "https://www.goodreads.com/book/show/31434883-eleanor-oliphant-is-completely-fine" },
  { "title": "The Lonely City – Olivia Laing", "link": "https://www.goodreads.com/book/show/25667449-the-lonely-city" },
  { "title": "The Perks of Being a Wallflower – Stephen Chbosky", "link": "https://www.goodreads.com/book/show/22628.The_Perks_of_Being_a_Wallflower" }
]
  },
  confident: {
    songs: [
      { title: "Eye of the Tiger – Survivor", link: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2" },
      { title: "Kar Har Maidaan Fateh – Sukhwinder Singh, Shreya Ghoshal", link: "https://open.spotify.com/track/3FHl1QYu76zguwjqhqcglX" },
      { title: "Lose Yourself – Eminem", link: "https://open.spotify.com/track/5Z01UMMf7V1o0MzF86s6WJ" },
      { title: "Zinda – Siddharth Mahadevan", link: "https://open.spotify.com/track/7vZz8oJ5qAqB9MghufRK5k" },
      { title: "Stronger – Kanye West", link: "https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3" },
      { title: "Titanium – David Guetta ft. Sia", link: "https://open.spotify.com/track/0TDLuuLlV54CkRRUOahJb4" },
      { title: "Sultan Title Track – Sukhwinder Singh, Shadab Faridi", link: "https://open.spotify.com/track/3kSBSSsXtebECjCggW87yq" },
      { title: "POWER – Kanye West", link: "https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc" },
      { title: "Lakshya Title Track – Shankar Mahadevan", link: "https://open.spotify.com/track/7o1yzUVkQt2Gto5yYvzo2T" },
      { title: "Seven Nation Army – The White Stripes", link: "https://open.spotify.com/track/3dPQuX8Gs42Y7b454ybpMR" }
    ],
    movies: [
      { title: "The Wolf of Wall Street", link: "https://www.imdb.com/title/tt0993846/" },
      { title: "Mary Kom", link: "https://www.imdb.com/title/tt3003730/" },
      { title: "Whiplash", link: "https://www.imdb.com/title/tt2582802/" },
      { title: "Dangal", link: "https://www.imdb.com/title/tt5074352/" },
      { title: "Rocky", link: "https://www.imdb.com/title/tt0075148/" },
      { title: "Bhaag Milkha Bhaag", link: "https://www.imdb.com/title/tt2356180/" },
      { title: "The Social Network", link: "https://www.imdb.com/title/tt1285016/" },
      { title: "Gully Boy", link: "https://www.imdb.com/title/tt2395469/" },
    ],
    books: [
  { "title": "You Are a Badass – Jen Sincero", "link": "https://www.goodreads.com/book/show/15837168-you-are-a-badass" },
  { "title": "Atomic Habits – James Clear", "link": "https://www.goodreads.com/book/show/40121378-atomic-habits" },
  { "title": "Daring Greatly – Brené Brown", "link": "https://www.goodreads.com/book/show/13596813-daring-greatly" }
]
  },
  overwhelmed: {
    songs: [
      { title: "Stop This Train – John Mayer", link: "https://open.spotify.com/track/3E6iea9uEmB7gRru4lyP6h" },
      { title: "Aaoge Jab Tum – Rashid Khan", link: "https://open.spotify.com/track/3fWMFwaJil8fD14JCgwbcL" },
      { title: "Landslide – Fleetwood Mac", link: "https://open.spotify.com/track/5ihS6UUlyQAfmp48eSkxuQ" },
      { title: "Lukka Chuppi – A.R. Rahman, Lata Mangeshkar", link: "https://open.spotify.com/track/500H9ENeR5AYbKU1ScK6ME" },
      { title: "everything i wanted – Billie Eilish", link: "https://open.spotify.com/track/3ZCTVFBt2Brf31RLEnCkWJ" },
      { title: "Dooriyan – Mohit Chauhan", link: "https://open.spotify.com/track/4Nu6be6Wgvqq60hFoRMqsc" },
      { title: "Slow Dancing in a Burning Room – John Mayer", link: "https://open.spotify.com/track/2d8JP84HNLKhmd6IYOoupQ" },
      { title: "breathin – Ariana Grande", link: "https://open.spotify.com/track/4OafepJy2teCjYJbvFE60J" },
      { title: "Breathe Me – Sia", link: "https://open.spotify.com/track/6KUY5wJCNvoB2JbXUJbHeW" },
      { title: "Iktara – Kavita Seth", link: "https://open.spotify.com/track/0RJ7HhnQxJEOpGC5Htmez4" }
    ],
    movies: [
      { title: "Everything Everywhere All at Once", link: "https://www.imdb.com/title/tt6710474/" },
      { title: "Marriage Story", link: "https://www.imdb.com/title/tt7653254/" },
      { title: "Masoom", link: "https://www.imdb.com/title/tt0085914/" },
      { title: "Inside Out", link: "https://www.imdb.com/title/tt2096673/" },
      { title: "Birdman", link: "https://www.imdb.com/title/tt2562232/" },
      { title: "Tamasha", link: "https://www.imdb.com/title/tt3148502/" },
      { title: "The Father", link: "https://www.imdb.com/title/tt10272386/" },
      { title: "A Death in the Gunj", link: "https://www.imdb.com/title/tt5929550/" },
    ],
    books: [
      { title: "Quiet – Susan Cain", link: "https://www.goodreads.com/book/show/12345678" },
      { title: "Furiously Happy – Jenny Lawson", link: "https://www.goodreads.com/book/show/23848559" },
      { title: "Essentialism – Greg McKeown", link: "https://www.goodreads.com/book/show/18077875" }
    ]
  },
  focused: {
    songs: [
      { title: "Interstellar Main Theme – Hans Zimmer", link: "https://open.spotify.com/track/6pWgRkpqVfxnj3WuIcJ7WP" },
      { title: "Time – Hans Zimmer", link: "https://open.spotify.com/track/6ZFbXIJkuI1dVNWvzJzown" },
      { title: "Clair de Lune – Claude Debussy", link: "https://open.spotify.com/track/6Er8Fz6fuZNi5cvwQjv1ya" },
      { title: "Midnight City – M83", link: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt" },
      { title: "Weightless – Marconi Union", link: "https://open.spotify.com/track/6kkwzB6hXLIONkEk9JciA6" },
      { title: "Khwaja Mere Khwaja (Instrumental) – A.R. Rahman", link: "https://open.spotify.com/track/27ZMX4m5dAv4X2XXiUQ3Vg" }
    ],
    movies: [
      { title: "The Social Network", link: "https://www.imdb.com/title/tt1285016/" },
      { title: "The Imitation Game", link: "https://www.imdb.com/title/tt2084970/" },
      { title: "Moneyball", link: "https://www.imdb.com/title/tt1210166/" },
      { title: "Steve Jobs", link: "https://www.imdb.com/title/tt2080374/" },
      { title: "Rocketry", link: "https://www.imdb.com/title/tt9263530/" },
      { title: "Limitless", link: "https://www.imdb.com/title/tt1219289/" },
      { title: "The Big Short", link: "https://www.imdb.com/title/tt1596363/" },
      { title: "Manjhi: The Mountain Man", link: "https://www.imdb.com/title/tt3449292/" },
    ],
    books: [
  { "title": "Deep Work – Cal Newport", "link": "https://www.goodreads.com/book/show/25744928-deep-work" },
  { "title": "Flow – Mihaly Csikszentmihalyi", "link": "https://www.goodreads.com/book/show/66354.Flow" },
  { "title": "The 5 AM Club – Robin Sharma", "link": "https://www.goodreads.com/book/show/37502596-the-5-am-club" }
]
  },
};

export default function Discover() {
  const { state } = useLocation();
  const mood = state?.mood || "happy";
  const theme = MOOD_THEMES[mood];
  const data = RECOMMENDATIONS[mood];

  const [user, setUser] = useState(null);
  const [favoritesMap, setFavoritesMap] = useState({});

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoritesMap({});
      return;
    }

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    const unsubSnap = onSnapshot(q, (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        map[d.data().title] = d.id;
      });
      setFavoritesMap(map);
    });

    return () => unsubSnap();
  }, [user]);

  const toggleFavorite = async (item, type) => {
    if (!user) {
      alert("Please log in to save items to your favorites!");
      return;
    }

    try {
      const existingId = favoritesMap[item.title];

      if (existingId) {
        await deleteDoc(doc(db, "favorites", existingId));
      } else {
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          mood,
          type,
          title: item.title,
          link: item.link || "",
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("FIRESTORE ERROR:", err);
      alert("Action failed. Check your database permissions.");
    }
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${theme} overflow-hidden`}>
      <img
        src={logo}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain opacity-10 blur-lg pointer-events-none"
      />

      <FloatingBubbles />

      <div className="relative z-10 max-w-6xl mx-auto pt-24 px-6 pb-20">
        <h1 className="text-3xl font-semibold text-center mb-12 capitalize">
          Discover for your {mood} mood
        </h1>

        {/* 📚 Books Section */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6 text-slate-700" /> Books
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {data.books.map((book, i) => {
            const saved = !!favoritesMap[book.title];
            return (
              <div key={i} className="bg-white/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <a
                  href={book.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium block mb-3 text-slate-800 hover:text-blue-600 transition"
                >
                  {book.title}
                </a>

                <button
                  onClick={() => toggleFavorite(book, "book")}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    saved ? "text-green-600 font-bold" : "text-pink-500 hover:scale-105"
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${saved ? "text-green-600" : "text-pink-400"}`} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            );
          })}
        </div>

        {/* 🎧 Songs Section */}
        <h2 className="text-xl font-semibold mb-4">🎧 Songs</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {data.songs.map((song, i) => {
            const saved = !!favoritesMap[song.title];
            return (
              <div key={i} className="bg-white/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <a
                  href={song.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium block mb-3 text-slate-800 hover:text-blue-600 transition"
                >
                  {song.title}
                </a>

                <button
                  onClick={() => toggleFavorite(song, "song")}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    saved ? "text-green-600 font-bold" : "text-pink-500 hover:scale-105"
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${saved ? "text-green-600" : "text-pink-400"}`} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            );
          })}
        </div>

        {/* 🎬 Movies Section */}
        <h2 className="text-xl font-semibold mb-4">🎬 Movies</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {data.movies.map((movie, i) => {
            const saved = !!favoritesMap[movie.title];
            return (
              <div key={i} className="bg-white/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <a
                  href={movie.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium block mb-3 text-slate-800 hover:text-blue-600 transition"
                >
                  {movie.title}
                </a>

                <button
                  onClick={() => toggleFavorite(movie, "movie")}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    saved ? "text-green-600 font-bold" : "text-pink-500 hover:scale-105"
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${saved ? "text-green-600" : "text-pink-400"}`} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}