export interface GoogleReview {
  name: string;
  initial: string;
  meta: string;
  /**
   * Approximate ISO date, derived from the relative label Google showed
   * ("2 weeks ago") when this list was captured on 2026-09-08. Stored as a
   * date rather than the label itself so the age is recomputed on every
   * render: the previous version hardcoded "4 days ago" strings, which
   * were still claiming "4 days ago" months later.
   */
  publishedAt: string;
  text: string;
  stars: number;
  /** The business's public reply, where one was left. */
  ownerReply?: string;
}

export const googleReviewsUrl = "https://g.page/r/CYfia2A_OulWEBM/review";
export const googleAverageRating = 5.0;
export const googleReviewCount = 54;

/** Renders an ISO date the way Google labels review ages. */
export function relativeFromIso(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "today";
  if (days === 1) return "a day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "a week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "a month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? "a year ago" : `${years} years ago`;
}

/**
 * Every review on the Google listing as of 2026-09-08, newest first.
 *
 * The public Places API only ever returns 5 of these, picked by relevance
 * rather than recency, so the full set cannot be synced automatically
 * without the Business Profile API. This list backs the /reviews page;
 * the homepage section shows whatever 5 Places is currently serving.
 *
 * Review text is the full text as left by the reviewer, expanded past the
 * "…More" cutoff Google shows on its own listing.
 */
export const googleReviews: GoogleReview[] = [
  {
    name: "Euan Munro",
    initial: "E",
    meta: "6 reviews",
    publishedAt: "2026-09-01",
    stars: 5,
    text: "Envirocycle Came and collected a rubbish uplift within 24 hours. The team are brilliant!",
  },
  {
    name: "Edward Nelson",
    initial: "E",
    meta: "1 review",
    publishedAt: "2026-08-25",
    stars: 5,
    text: "Terrific service from initial contact. They came next morning and cleared all my old carpets and underlay, super efficient and very competitively priced. These are the guys to use for your household's waste. Highly recommend",
  },
  {
    name: "Angela Easton",
    initial: "A",
    meta: "1 review",
    publishedAt: "2026-08-25",
    stars: 5,
    text: "Great service, fast efficient and professional. Asked Chris when he came to do a extra job for me and it was done no problem. Highly recommended 👌",
  },
  {
    name: "Samantha Mclean",
    initial: "S",
    meta: "2 reviews",
    publishedAt: "2026-08-18",
    stars: 5,
    text: "Service was great start to finish! Helped to remove items from a vulnerable adults home at short notice. Professional and efficient. Will 100% use again!",
  },
  {
    name: "Charley Bennett",
    initial: "C",
    meta: "2 reviews",
    publishedAt: "2026-08-18",
    stars: 5,
    text: "Chris and Liam provided a great service. Amazing communication, on time and they offer a really competitive price. Thank you!",
    ownerReply:
      "Thanks for the kind review Charley - we are glad you were happy with the service we carried out.",
  },
  {
    name: "craig frew",
    initial: "C",
    meta: "7 reviews",
    publishedAt: "2026-08-11",
    stars: 5,
    text: "Brilliant service from Enviro Cycle Glasgow. The uplift was quick, professional and completely hassle-free from start to finish. The team arrived when expected, got everything cleared efficiently and left the area clean and tidy. Friendly, reliable and reasonably priced. Would definitely use them again and highly recommend to anyone needing an uplift in Glasgow. Great job guys! 👏",
    ownerReply:
      "Thanks for the kind review Craig! We pride ourselves on providing a great service to our customers - Thanks again.",
  },
  {
    name: "brandon Mcguinness67",
    initial: "B",
    meta: "2 reviews",
    publishedAt: "2026-08-11",
    stars: 5,
    text: "Great service work done was brilliant and on same day as phoning👌",
    ownerReply:
      "Thanks for the kind review Brandon - we aim to be as responsive as possible for our customers and glad we could help you with the same day collection that you required.",
  },
  {
    name: "Declan Maguire",
    initial: "D",
    meta: "3 reviews",
    publishedAt: "2026-08-11",
    stars: 5,
    text: "Handles my garages waste on a weekly basis professional and extremely reliable and very fairly priced highly recommended",
    ownerReply:
      "Thank you for the kind review Declan we are glad you are happy with the service we've been providing you over the last few months, long may the relationship last.",
  },
  {
    name: "Ross Simpson",
    initial: "R",
    meta: "4 reviews · 1 photo",
    publishedAt: "2026-08-01",
    stars: 5,
    text: "Top class service",
    ownerReply:
      "Thanks again for trusting Envirocycle Glasgow for managing your waste Ross!",
  },
  {
    name: "Craig Lannigan",
    initial: "C",
    meta: "Local Guide · 30 reviews · 1 photo",
    publishedAt: "2026-08-01",
    stars: 5,
    text: "Great service from a great team. Stress free and job done to a great standard.",
    ownerReply:
      "Glad to hear you were happy with the service carried out by us Craig! We always appreciate kind words.",
  },
  {
    name: "Alexander Adair",
    initial: "A",
    meta: "2 reviews",
    publishedAt: "2026-08-01",
    stars: 5,
    text: "Great fast efficient service for a great price, highly recommend",
    ownerReply: "Thank you for the kind words Alexander!",
  },
  {
    name: "Reece Masterton",
    initial: "R",
    meta: "1 review",
    publishedAt: "2026-08-01",
    stars: 5,
    text: "Enquired with the guys at Envirocycle to get some trade waste removed from a site I was working on. Within the hour we had agreed a price and the waste was collected and disposed off. Always peace of mind knowing your waste is being dealt with by a SEPA licensed waste carrier as-well. Great work lads! Will use again and certainly recommend.",
    ownerReply:
      "Really glad to hear you were happy with the service you received from the team here at ECG! Hope to see you again soon.",
  },
  {
    name: "Oliwia Walczak",
    initial: "O",
    meta: "6 reviews",
    publishedAt: "2026-08-01",
    stars: 5,
    text: "Honestly can't recommend these guys enough! After being let down for 2 days these guys were able to step in and help out an hour from messaging them! Very reasonable pricing, friendly and great communication.",
    ownerReply:
      "Really appreciate the kind review Oliwia! We pride ourselves on first class customer service and we are glad you are happy with the work we carried out. Thanks again.",
  },
  {
    name: "Laura McDaide",
    initial: "L",
    meta: "4 reviews · 1 photo",
    publishedAt: "2026-08-01",
    stars: 5,
    text: "Needed an uplift after doing a clear out. Dropped an enquiry onto the website and was called straight away by Christopher with a quote and the boys came within the hour to collect the stuff. Fab service would definitely recommend and will know who to call in the future! Thanks guys 🤩",
    ownerReply: "Thank you Laura!",
  },
  {
    name: "Jamie Shepherd",
    initial: "J",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Used Envirocycle for the first time and the service was first class. Communication was spot on to ensure we were happy with the date and time and the job was carried out exactly as we had hoped. Would highly recommend this company.",
    ownerReply: "Thank you Jamie!",
  },
  {
    name: "Hanna Quintus",
    initial: "H",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Amazing service! Quick to respond and make booking etc. Very reasonable prices and very reliable. Thanks",
    ownerReply: "Thank you Hana!",
  },
  {
    name: "Lauren Edge",
    initial: "L",
    meta: "1 review",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Brilliant service, fast, friendly, and professional. Great communication and everything was taken care of without any hassle. Would definitely use again",
    ownerReply: "Thank you Lauren!",
  },
  {
    name: "Natalie Mccormick",
    initial: "N",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Excellent service from start to finish! The team was professional and incredibly efficient. They made the whole waste removal process quick and completely hassle-free. Communication was great throughout, and they left everything clean and tidy once the job was finished. It's clear they take pride in their work and genuinely care about providing a high standard of service. I wouldn't hesitate to recommend them to anyone looking for a reliable and trustworthy waste management company!",
    ownerReply: "Thank you Natalie!",
  },
  {
    name: "j A electric",
    initial: "J",
    meta: "1 review",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Very polite guys tidy and very reasonable price on time and no messing about",
    ownerReply: "Thank you!",
  },
  {
    name: "Nathan Boyd",
    initial: "N",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "The guys were polite, efficient, and careful. They handled stairs and tight access without any fuss, cleared everything (old sofas, appliances, construction debris, you name it), and left the place spotless.",
    ownerReply: "Thank you Nathan!",
  },
  {
    name: "Eilidh Gunn",
    initial: "E",
    meta: "3 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Great service 😊",
    ownerReply: "Thank you Eilidh!",
  },
  {
    name: "Kwame Harrison",
    initial: "K",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "10/10 service from Chris and Liam! Would highly recommend, very friendly and professional.",
    ownerReply: "Thank you Kwame!",
  },
  {
    name: "orla oneill",
    initial: "O",
    meta: "1 review",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "The guys at Envirocycle were quick, efficient and reliable. Within an hour of getting in touch with them the job was completed! 🤩",
    ownerReply: "Thank you Orla!",
  },
  {
    name: "Ryan Waugh",
    initial: "R",
    meta: "5 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "I've used envirocycle a few times now and they have always been 10/10. Good communication, fast collection times and very good pricing!",
    ownerReply: "Thank you Ryan!",
  },
  {
    name: "Alina Bell",
    initial: "A",
    meta: "6 reviews · 10 photos",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "I couldn't recommend Envirocycle enough. Chris and Liam provided a fantastic service from beginning to end. They were professional and kept me updated with great communication throughout the whole process. They were both friendly, respectful, and made everything straightforward and stress-free. The work was completed efficiently, and the pricing was very fair. They provide high-quality service and i'd definitely use Envirocycle again and would highly recommend them to anyone needing a reliable and trustworthy team. Thank you again!",
    ownerReply:
      "Thank you for the kind review Alina! We strive to provide a good service across the board!",
  },
  {
    name: "Chris Church",
    initial: "C",
    meta: "3 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Had the boys from Envirocycle out to clear out our shed and driveway after plenty of refurb mess. They done a brilliant job. Fast and efficient service. Would recommend Envirocycle to anyone",
    ownerReply: "Thank you Chris!",
  },
  {
    name: "Natasha Connelly",
    initial: "N",
    meta: "1 review",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Amazing service from Chris and Liam at Envirocycle. On time, really friendly, great communication and reasonable prices 😄",
    ownerReply: "Thank you Natasha!",
  },
  {
    name: "Max Cowe",
    initial: "M",
    meta: "6 reviews · 2 photos",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "The lads at Envirocycle have completed several jobs for us now - clearing sheds, removing old decking etc. The whole process has been quick and easy. I also loved the fact they swept up after themselves, something which most tradesmen seem to forget these days!! Absolutely recommend the team at Envirocycle, and urge people to get in touch! 👍🏼",
    ownerReply:
      "Thank you for the kind review Max! Thanks for putting your trust in us to be involved in your garden renovations and handling the waste throughout the process!",
  },
  {
    name: "Cameron Fulton",
    initial: "C",
    meta: "2 reviews · 1 photo",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "The work these guys did was absolutely brilliant. Efficient, great communication throughout and even got the job completed ahead of schedule. High standard of work, reasonable price and ensured I was happy with their work before charging. Can't thank them or recommend them enough. Wouldnt think twice before using them again.",
    ownerReply: "Thank you Cameron! We are glad you are happy with the service!",
  },
  {
    name: "Sharpprintanddesign",
    initial: "S",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "The guys at envirocycle were fast, professional, and priced brilliantly. Came to our unit late hours of the night and really want above and beyond for us. Would highly recommend them for any waste or removal services!",
    ownerReply: "Thanks a lot guys!",
  },
  {
    name: "Nathan McInulty",
    initial: "N",
    meta: "2 reviews",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "We have used Envirocycle for both business removals and for personal jobs needing taken care off professionally and efficiently. They have went above and beyond every time and we couldn't recommend them enough. Thanks again for all the great work carried out for us and looking forward to any future work.",
    ownerReply: "Thank you Nathan!",
  },
  {
    name: "B",
    initial: "B",
    meta: "Local Guide · 7 reviews · 1 photo",
    publishedAt: "2026-07-08",
    stars: 5,
    text: "Needed a chest of drawers dumped that had started to break mid house move. Contacted late afternoon. Sent pics got very reasonable quote. Guys came a couple hours later. Both extremely polite communicative and friendly. Respected the property. Brilliant fast turn around. Highly recommend and will use again without fail if need anything else disposed off.",
    ownerReply: "Thank you!",
  },
  {
    name: "Leah Cruickshanks",
    initial: "L",
    meta: "3 reviews",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "Lovely guys who put in a hard graft. Great communication on lead up to the job, fair pricing, fast and good job done. Would recommend to anyone and will use them again in future 😊 Thanks again guys",
    ownerReply: "Thank you Leah!",
  },
  {
    name: "Daniel Henderson",
    initial: "D",
    meta: "1 review",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "Had the lads from envirocycle out to do a bit of work clearing my back garden and drive. Done a great job and arrived on time, left the place spotless. Would highly recommend and definitely using again for any other work needing done 👍🏼",
    ownerReply: "Thank you Daniel!",
  },
  {
    name: "Dylan Howat",
    initial: "D",
    meta: "1 review",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "Superb service very friendly and excellent communication. Very speedy service, taking care on my property. Would highly recommend and will use again",
    ownerReply: "Thank you Dylan!",
  },
  {
    name: "Stu M",
    initial: "S",
    meta: "2 reviews",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "Excellent service from the guys at envirocycle. Came out on time, took all waste away and empties bins. Good price good results",
    ownerReply: "Thank you Stuart!",
  },
  {
    name: "Paul Lappin",
    initial: "P",
    meta: "3 reviews · 1 photo",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "The boys done are a great job really professional and helpful",
    ownerReply: "Thank you Paul!",
  },
  {
    name: "Gary Adair",
    initial: "G",
    meta: "12 reviews",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "I had an excellent experience with Envirocycle Glasgow Ltd, and I wouldn't hesitate to recommend them to anyone looking for a reliable, professional service. I don't usually write reviews but the level of attention to detail received and the positive customer experience prompted me to leave one. From the outset, they were friendly, knowledgeable and professional. They arrived on time, worked quickly, and handled everything with care and left the space clean and tidy, which made a big difference. Another strong point is their commitment to environmentally responsible practices. It's reassuring to know that waste is being processed thoughtfully and sustainably rather than simply being discarded on a dumping site. Would definitely recommend and use again.",
    ownerReply: "Thank you Gary!",
  },
  {
    name: "Laura Henderson",
    initial: "L",
    meta: "3 reviews",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "Excellent service from Chris and Liam at Envirocycle - reliable, efficient and friendly. Will definitely use again.",
    ownerReply: "Thank you Laura!",
  },
  {
    name: "Ellie",
    initial: "E",
    meta: "2 reviews · 4 photos",
    publishedAt: "2026-06-08",
    stars: 5,
    text: "Amazing work. Messaged late Saturday afternoon and they came the following morning. Was quick and efficient. Would highly recommend.",
    ownerReply: "Thank you Ellie!",
  },
  {
    name: "Alex Paterson",
    initial: "A",
    meta: "1 review",
    publishedAt: "2026-05-08",
    stars: 5,
    text: "Excellent, fast service the guys keep you updated on when they are coming. Highly recommend this company",
    ownerReply: "Thank you Alex!",
  },
  {
    name: "Craig Matthews",
    initial: "C",
    meta: "2 reviews",
    publishedAt: "2026-04-08",
    stars: 5,
    text: "Would use again without hesitation guys were professional from the first conversation and done exactly what was asked of them with area left clean and tidy! Top job all round.",
    ownerReply: "Thank you Craig!",
  },
  {
    name: "Carolyn Bryce",
    initial: "C",
    meta: "1 review",
    publishedAt: "2026-03-08",
    stars: 5,
    text: "Absolutely Fab company very professional came out discussed what I was needing which was a tidy of my garden and clear of shed gave excellent quote and arrived on the day exactly on time and did excellent job would thoroughly recommend",
    ownerReply: "Thank you Carolyn!",
  },
  {
    name: "Barry Forde",
    initial: "B",
    meta: "1 review",
    publishedAt: "2026-03-08",
    stars: 5,
    text: "Great communication, quick service. I would highly recommend and use again.",
    ownerReply: "Thank you Barry!",
  },
  {
    name: "Leeann Heenan",
    initial: "L",
    meta: "1 review",
    publishedAt: "2026-02-08",
    stars: 5,
    text: "Would highly recommend using this company. Guys were on time, professional and friendly. Great prices too. Cleared out my garage and cleaned up my drive after it. Great job 👍",
    ownerReply: "Thank you Leeann!",
  },
  {
    name: "Ootinthe Eighties",
    initial: "O",
    meta: "7 reviews",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "Fantastic work carried out by the team. Fast and efficient. This is the second time we've needed the help of Envirocycle and can highly recommend them.",
    ownerReply: "Thanks for the review!",
  },
  {
    name: "Yvonne Allan",
    initial: "Y",
    meta: "1 review",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "Excellent service from Envirocycle Glasgow!! Would highly recommend them. Showed up at the agreed time and cleared up real quick making the whole rubbish pick up easy and stress free. Liam and Christopher were really friendly and it was a fab price too!!! Will defo be using them again! Thanks again guys!",
    ownerReply: "Thank you!",
  },
  {
    name: "D SM",
    initial: "D",
    meta: "15 reviews",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "Prompt, polite and competitive prices, brilliant!!",
    ownerReply: "Thank you!",
  },
  {
    name: "Cameron Curran",
    initial: "C",
    meta: "1 review",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "Great service! Reliable, and friendly. They make the whole process easy and stress-free. Highly recommend!",
    ownerReply: "Thank you!",
  },
  {
    name: "Kyle Wilson",
    initial: "K",
    meta: "5 reviews",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "The lads are great. Affordable and most importantly they are SEPA licensed and dispose of waste properly! Highly recommend 👍🏼",
  },
  {
    name: "Kenny Law",
    initial: "K",
    meta: "1 review",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "Brilliant service and great job. Will definitely use your company again.",
  },
  {
    name: "Eva Allan",
    initial: "E",
    meta: "2 reviews",
    publishedAt: "2025-12-08",
    stars: 5,
    text: "Excellent service from start to finish! The team arrived on time, worked efficiently, and left the area spotless. They handled everything professionally and even recycled as much as possible, which I really appreciate. It's great to see a company that genuinely cares about the environment. Highly recommend them for anyone needing reliable rubbish or recycling collection.",
  },
  {
    name: "Alex Connelly",
    initial: "A",
    meta: "5 reviews",
    publishedAt: "2025-11-08",
    stars: 5,
    text: "Very good and reliable service from Liam and Christopher. Would recommend to anyone 👍",
  },
  {
    name: "Jude Higgins",
    initial: "J",
    meta: "3 reviews",
    publishedAt: "2025-11-08",
    stars: 5,
    text: "Excellent service: reliable, professional, and on time. Highly recommend to anyone 👍",
  },
];
