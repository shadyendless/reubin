/**
 * @jest-environment node
 */

import { server } from "../src/app";
import gql from "graphql-tag";
import base64 from "base-64";
import cuid from "cuid";

const newUserMock = {
	email: `test-${cuid()}@charlieisamazing.com`,
	password: base64.encode("P@ssw0rd"),
};

const mocks: Record<"authToken" | "currentFeed" | "currentTag", string | null> = {
	authToken: null,
	currentFeed: null,
	currentTag: null,
};

describe("GraphQL Server", () => {
	beforeAll(() => {
		console.log("Using the following credentials:\n", JSON.stringify(newUserMock, null, 2));
	});

	test("can create users", async () => {
		const result = await server.executeOperation<any>({
			query: gql`
				mutation Register($email: String!, $password: String!) {
					createUser(email: $email, password: $password) {
						token
						user {
							id
							email
						}
					}
				}
			`,
			variables: newUserMock,
		});

		if (result.body.kind === "single") {
			mocks.authToken = result.body.singleResult.data?.createUser?.token;
			const { data } = result.body.singleResult;
			expect(data.createUser.token).not.toBeNull();
			expect(data.createUser.user.email).not.toBeNull();
			expect(data.createUser.user.email).toContain("@charlieisamazing.com");
		} else {
			throw new Error("result.body.kind is not single");
		}
	});

	test("can create feeds", async () => {
		const feedResult = await server.executeOperation<any>(
			{
				query: gql`
					mutation CreateFeed($url: String!) {
						addFeed(url: $url) {
							id
							title
						}
					}
				`,
				variables: {
					url: "https://discord.com/blog/rss.xml",
				},
			},
			{
				contextValue: {
					token: mocks.authToken,
				},
			}
		);

		if (feedResult.body.kind !== "single") {
			throw new Error("feedResult.body.kind is not single");
		}

		expect(feedResult.body.singleResult.data.addFeed.title).toEqual("Discord Blog");

		mocks.currentFeed = feedResult.body.singleResult.data.addFeed.id;
	});

	test("feeds can create entries", async () => {
		/// Technically this should fail because this operation isn't authenticated
		/// but it's not failing because of the current implementation of the
		/// feed controller. This is a bug that needs to be fixed.
		const entryListResult = await server.executeOperation<any>({
			query: gql`
				query EntriesByFeed($id: ID!) {
					entries(feed_id: $id) {
						title
						content
						id
						unread
						published
					}
				}
			`,
			variables: {
				id: mocks.currentFeed,
			},
		});

		if (entryListResult.body.kind !== "single") {
			throw new Error("entryListResult.body.kind is not single");
		}

		expect(entryListResult.body.singleResult.data?.entries?.length).toBeGreaterThan(1);
	});

	test("cannot fetch feeds user did not create", async () => {
		await prisma?.feed.create({
			data: {
				title: "Filecoin",
				feedURL: "https://filecoin.io/blog/feed/index.xml",
				link: "https://filecoin.io/",
			},
		});

		const feedListResult = await server.executeOperation<any>(
			{
				query: gql`
					query GetFeeds {
						feeds {
							id
							title
							link
							feedURL
						}
					}
				`,
			},
			{
				contextValue: {
					token: mocks.authToken,
				},
			}
		);

		if (feedListResult.body.kind !== "single") {
			throw new Error("feedListResult.body.kind is not single");
		}

		expect(feedListResult.body.singleResult.data?.feeds?.length).toEqual(1);

		const feeds = feedListResult.body.singleResult.data?.feeds.map((f: any) => f.feedURL);
		expect(feeds).not.toContain("https://filecoin.io/blog/feed/index.xml");
		expect(feeds).toContain("https://discord.com/blog/rss.xml");
	});

	test("can create tags", async () => {
		const result = await server.executeOperation<any>(
			{
				query: gql`
					mutation CreateTag($name: String!) {
						addTag(name: $name) {
							id
							title
						}
					}
				`,
				variables: {
					name: "Test Tag",
				},
			},
			{
				contextValue: {
					token: mocks.authToken,
				},
			}
		);

		if (result.body.kind !== "single") {
			throw new Error("result.body.kind is not single");
		}

		mocks.currentTag = result.body.singleResult.data.addTag.id;
		expect(result.body.singleResult.data.addTag.title).toEqual("Test Tag");
		expect(mocks.currentTag).not.toBeNull();
	});

	test("can tag feeds", async () => {
		const result = await server.executeOperation<any>(
			{
				query: gql`
					fragment FeedDetails on Feed {
						id
						title
						link
						feedURL
						tag
					}

					mutation UpdateFeedTitle($input: UpdateFeedInput, $id: ID!) {
						updateFeed(id: $id, fields: $input) {
							...FeedDetails
						}
					}
				`,
				variables: {
					input: {
						tagID: mocks.currentTag,
					},
					id: mocks.currentFeed,
				},
			},
			{
				contextValue: {
					token: mocks.authToken,
				},
			}
		);

		if (result.body.kind !== "single") {
			throw new Error("result.body.kind is not single");
		}

		expect(mocks.currentTag).not.toBeNull();
		expect(result.body.singleResult.data.updateFeed.tag).toEqual(mocks.currentTag);
	});

	test("can fetch feeds by tag", async () => {
		const result = await server.executeOperation<any>(
			{
				query: gql`
					query GetFeedsByTag($id: ID!) {
						feeds(tag_id: $id) {
							id
							title
							link
							feedURL
							tag
						}
					}
				`,
				variables: {
					id: mocks.currentTag,
				},
			},
			{
				contextValue: {
					token: mocks.authToken,
				},
			}
		);

		if (result.body.kind !== "single") {
			throw new Error("result.body.kind is not single");
		}

		expect(result.body.singleResult.data?.feeds?.length).toEqual(1);
		expect(result.body.singleResult.data?.feeds[0].tag).toEqual(mocks.currentTag);
	});
	test.todo("can fetch entries by tag and unread");
	test.todo("can remove tags");
	test.todo("removing tag does not remove feed");
	test.todo("can remove feed and all relevant entries");
	test.todo("can bookmark entries");
	test.todo("can fetch entries by bookmarked");
	test.todo("can mark entries as read");
	test.todo("can fetch entries by unread");
	test.todo("can refresh feeds");
});
