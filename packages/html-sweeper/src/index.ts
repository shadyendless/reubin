import htmlparser, { type ParserOptions } from "htmlparser2";

interface CleanOptions {
	baseURL: string;
}

export class HTMLSanitizer {
	constructor() {}

	public clean(htmlBody: string, opts: Partial<CleanOptions> = {}): string {
		return "";
	}
}
