const NEWS = [
	{
		link: "https://www.vox.com/rss/index.xml",
		displayName: "Vox",
	},
	{
		link: "https://www.out.com/rss.xml",
		displayName: "Out.com",
	},
	{
		link: "https://www.buzzfeed.com/world.xml",
		displayName: "BuzzFeed World News",
	},
	{
		link: "https://nautil.us/rss/all",
		displayName: "Nautilus",
	},
	{
		link: "https://thedailywhat.cheezburger.com/rss",
		displayName: "Daily What",
	},
];

const TECH = [
	{
		link: "https://xkcd.com/atom.xml",
		displayName: "xkcd",
	},
	{
		link: "https://www.theverge.com/web/rss/index.xml",
		displayName: "The Verge",
	},
	{
		link: "https://future.a16z.com/feed/",
		displayName: "Future",
	},
	{
		link: "https://cointelegraph.com/rss",
		displayName: "Coin Telegraph",
	},
];

const LIFESTYLE = [
	{
		link: "https://www.apartmenttherapy.com/main.rss",
		displayName: "Apartment Therapy",
	},
];

const RELEVANT = [
	{
		link: "https://charliewil.co/rss.xml",
		displayName: "Charlie's Blog",
	},
	{
		link: "https://typescript.wtf/rss.xml",
		displayName: "TypeScript & React for Everyone",
	},
];

export const RecommendationMap = new Map([
	["News", NEWS],
	["Tech", TECH],
	["Lifestyle", LIFESTYLE],
	["Relevant", RELEVANT],
]);
