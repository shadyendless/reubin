import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  enum EntryFilter {
    UNREAD
    ALL
    FAVORITED
  }

  type Feed {
    id: ID!
    title: String!
    link: String!
    lastFetched: Date!
    feedURL: String!
  }

  type Tag {
    id: ID!
    title: String!
  }

  type Activity {
    unread: [Int]!
    starred: [Int]!
  }

  type Entry {
    id: ID!
    feed_id: ID!
    title: String!
    url: String
    """
    HTML String
    """
    content: String
    author: String
    published: Date
    created_at: Date
    unread: Boolean!
    favorite: Boolean!
  }

  type Query {
    tags: [Tag]!
    feeds: [Feed]!
    entry(id: ID!): Entry!
    feed(id: ID!): Feed!
    entries(feed_id: ID!, filter: EntryFilter): [Entry!]!
  }

  type Mutation {
    addFeed(url: String!): Feed!
    addTag(name: String!): Tag!
    removeFeed(id: ID!): Feed!
    refreshFeed(id: ID!): [Entry!]!
    markAsFavorite(id: ID!, favorite: Boolean!): Entry!
    markAsRead(id: ID!): Entry!
    updateFeed(id: ID!, title: String!): Feed!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
