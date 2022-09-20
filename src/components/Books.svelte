<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fetchUserById, fetchStories } from '../utils/api-request';
	import { familyId } from '../store';

	interface Chapter {
		chapter_src: string;
		created_by: string;
		played: boolean;
	}

	interface bookItem {
		storyId: {
			chapters: Chapter[];
			cover: string;
			created_at: number;
			created_by: string;
			families: {
				family_id: boolean;
			};
			title: string;
		};
	}

	interface Book {
		fileName: string;
		title: string;
		artworkPath: string;
		url: string;
		storyId: string;
		createdBy: string;
	}
	let srcBook = 'images/book.png';
	let srcOwl = 'images/owl-logo.png';

	let books: Book[] = [];

	let areStoriesLoading: boolean = true;

	const getBooks = async () => {
		try {
			const returnedBooks = await fetchStories($familyId);

			Promise.all(
				returnedBooks.map(async (bookItem: bookItem) => {
					const userId = Object.values(bookItem)[0].created_by;
					const userData = await fetchUserById(userId);
					const displayName = userData.display_name;

					const story = {
						createdBy: displayName,
						storyId: Object.keys(bookItem)[0],
						artworkPath: srcBook,
						title: Object.values(bookItem)[0].title
					};

					return story;
				})
			)
				.then((result) => (books = result))
				.then(() => {
					areStoriesLoading = false;
				});
		} catch (error) {
			console.error(error);
		}
	};

	onMount(() => {
		getBooks();
	});
</script>

<h2 class="text-center font-Josefin text-4xl font-normal text-amber-100">Our Bookshelf</h2>
{#if areStoriesLoading}
	<div class="loader"><img class="m-auto mt-12 w-12" src={srcOwl} alt="" /></div>
{:else if books.length > 0}
	<ul class="flex-wrap items-stretch justify-center gap-5 lg:mx-80 lg:flex">
		{#each books as book}
			<a
				class:active={$page.url.pathname === `/bookshelf/${book.storyId}`}
				sveltekit:prefetch
				href={`/bookshelf/${book.storyId}`}
			>
				<li
					class="m-auto mb-5 mt-5 max-w-xs shrink rounded border-8 border-solid border-[#b9f6ca] bg-amber-100 py-5 text-center lg:p-4"
				>
					<h2 class="text-2xl lg:text-lg">{book.title}</h2>
					<img src={book.artworkPath} alt={book.title} class=" m-auto mt-4 mb-4 max-w-[13rem]" />
					<p>Recorded by: {book.createdBy}</p>
					<a
						class:active={$page.url.pathname === `/bookshelf/${book.storyId}`}
						sveltekit:prefetch
						href={`/bookshelf/${book.storyId}`}
						class="underline decoration-solid decoration-2 underline-offset-4">Listen to story</a
					>
				</li>
			</a>
		{/each}
	</ul>
{:else}
	<p class="my-6 text-center text-amber-100">
		Your family hasn't recorded any stories yet. Why not record one now?
	</p>
	<p class="text-center font-Josefin font-normal text-amber-100">
		<a
			class:active={$page.url.pathname === `/record`}
			sveltekit:prefetch
			href={`/record`}
			class="underline decoration-solid decoration-2 underline-offset-4">Record a story</a
		>
	</p>
{/if}

<style>
	.loader {
		animation: rotation 2s infinite linear;
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
</style>
