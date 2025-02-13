import { use } from "react";
import { cookies } from "next/headers";

import { CreateTagForm } from "../../../components/create-tag";
import { TagRemovalList } from "../../../components/tag-lists";
import { getAllTags, me } from "../../../lib/graphql";
import type { AllTagsQuery } from "../../../lib/__generated__";
import { authorizeRequest } from "../../../lib/authorized-request";

export default function SettingsPage() {
	const nextCookies = cookies();
	const _ = use<AllTagsQuery>(authorizeRequest(nextCookies, getAllTags()));

	const __ = use(me());

	console.log(__);

	return (
		<section className="w-full flex-1 p-4">
			<h1 className="text-3xl font-bold tracking-tight ">Settings</h1>
			<pre>{JSON.stringify(__, null, 4)}</pre>
			<h2>Tags</h2>
			<div className="grid max-w-6xl grid-cols-12 gap-8">
				<div className="col-span-12 lg:col-span-6">
					<CreateTagForm />
				</div>
				<div className="col-span-12 lg:col-span-6">
					<h3 className="mb-8 text-2xl">Your Tags</h3>
					<TagRemovalList initialData={_} />
				</div>
			</div>
		</section>
	);
}
