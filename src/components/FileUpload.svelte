<script lang="ts">
	import { ref, uploadBytesResumable } from 'firebase/storage';
	import { storage } from '../utils/admin';

	import { recordingIsDisabled, stopIsDisabled, uploadIsDisabled, resetIsDisabled } from '../store';
	import { onMount } from 'svelte';
	import { fetchStories, postStory, addChapter } from '../utils/api-request';

	import { userId, familyId } from '../store';

	export let recordingFile: Blob;
	let fileUploaded: boolean = false;
	let isUploading: boolean = false;
	let progress: number = 0;
	let errorMessage: string = '';
	let onlineStatus: boolean = false;
	let noStoryTitle: boolean = false;
	let isNewStory: boolean = false;
	let isAddToStory: boolean = false;
	let storyId: string = '';
	let selected: any;
	let storySelected: boolean = false;

	interface Chapter {
		chapter_src: string;
		created_by: string;
		played: boolean;
	}

	interface Story {
		title: string;
	}
	let stories: Story[] = [];

	interface storyItem {
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

	onMount(async () => {
		recordingIsDisabled.set(false);
		stopIsDisabled.set(false);
		uploadIsDisabled.set(false);
	});

	// specify where to store recordings in firebase
	// Date.now() is temp workaround to create unique(ish) filenames and prevent overwriting
	const recordingRef = ref(storage, `recordings/recording-${Date.now()}.ogg`);

	let newStory = {
		title: '',
		userId: $userId,
		familyId: $familyId,
		chapterSource: recordingRef.toString()
	};

	let newChapter = {
		userId: $userId,
		chapterSource: recordingRef.toString()
	};

	const handleNewStory = () => {
		isNewStory = true;
		isAddToStory = false;
		storySelected = false;
	};

	const handleAddToStory = () => {
		isAddToStory = true;
		isNewStory = false;
		noStoryTitle = false;
	};

	const uploadFile = () => {
		if (/[a-zA-Z]/.test(newStory.title)) {
			isNewStory = false;
			isAddToStory = false;
			storySelected = false;
			noStoryTitle = false;
			$stopIsDisabled = true;
			$resetIsDisabled = true;
			isUploading = true;
			const uploadTask = uploadBytesResumable(recordingRef, recordingFile);

			uploadTask.on(
				'state_changed',
				(progressSnapshot) => {
					progress = (progressSnapshot.bytesTransferred / progressSnapshot.totalBytes) * 100;
					if (progress === 100) fileUploaded = true;
				},
				(error) => {
					switch (error.code) {
						case 'storage/unauthorized':
							errorMessage = 'You currently do not have the correct permissions to upload stories.';
							break;
						case 'storage/canceled':
							errorMessage = 'You have cancelled the upload.';
							break;
						case 'storage/unauthenticated':
							errorMessage = 'Unauthenticated user detected. Please check your login.';
							break;
						case 'storage/bucket-not-found':
						case 'storage/project-not-found':
							errorMessage =
								'We are currently experiencing some technical issues. Please try again later.';
							break;
					}
				},
				() => {
					postStory(newStory);
				}
			);
		} else {
			noStoryTitle = true;
		}
	};

	const patchStory = () => {
		if (selected.storyId) {
			isAddToStory = false;
			isNewStory = false;
			$stopIsDisabled = true;
			$resetIsDisabled = true;
			isUploading = true;
			const uploadTask = uploadBytesResumable(recordingRef, recordingFile);

			uploadTask.on(
				'state_changed',
				(progressSnapshot) => {
					progress = (progressSnapshot.bytesTransferred / progressSnapshot.totalBytes) * 100;
					if (progress === 100) fileUploaded = true;
				},
				(error) => {
					switch (error.code) {
						case 'storage/unauthorized':
							errorMessage = 'You currently do not have the correct permissions to upload stories.';
							break;
						case 'storage/canceled':
							errorMessage = 'You have cancelled the upload.';
							break;
						case 'storage/unauthenticated':
							errorMessage = 'Unauthenticated user detected. Please check your login.';
							break;
						case 'storage/bucket-not-found':
						case 'storage/project-not-found':
							errorMessage =
								'We are currently experiencing some technical issues. Please try again later.';
							break;
					}
				},
				() => {
					addChapter(newChapter, storyId);
				}
			);
		} else {
			storySelected = true;
		}
	};

	const handleReset = () => {
		isAddToStory = false;
		isNewStory = false;
		recordingIsDisabled.set(false);
		stopIsDisabled.set(false);
		uploadIsDisabled.set(false);
		isUploading = false;
		fileUploaded = false;
		progress = 0;
		newStory.title = '';
		newStory.chapterSource = '';
		$resetIsDisabled = true;
	};

	const getStories = async () => {
		const returnStories = await fetchStories($familyId);

		stories = returnStories.map((story: storyItem) => {
			return { title: Object.values(story)[0].title, storyId: Object.keys(story)[0] };
		});
	};

	onMount(() => {
		getStories();
	});
</script>

<svelte:window bind:online={onlineStatus} />

{#if $stopIsDisabled && !fileUploaded}
	<p class="mt-4 text-center text-amber-100">
		Ready to upload, create a new story or add to an exisiting story?
	</p>
	<section class="mt-2 flex-col text-center">
		<button class="mx-1.5 my-4 rounded bg-[#b9f6ca] px-3 py-1" on:click={handleNewStory}
			>New Story</button
		>
		<button class="mx-1.5 my-4 rounded bg-[#b9f6ca] px-3 py-1" on:click={handleAddToStory}
			>Add to a Story</button
		>
	</section>
{/if}

<section class="flex-col pb-0 text-center">
	{#if isAddToStory && $uploadIsDisabled}
		<section class="mx-auto mt-2 flex-col text-center">
			<select
				bind:value={selected}
				on:change={() => {
					storyId = selected.storyId;
				}}
				class="mt-0 rounded p-2"
			>
				<option disabled>select a story</option>
				{#each stories as story}
					<option value={story}>{story.title}</option>
				{/each}
			</select>
		</section>
	{/if}

	{#if isNewStory && $uploadIsDisabled}
		<form>
			<label class="text-amber-100"
				>Story name <input
					class="text-[#000000]"
					type="text"
					required
					disabled={isUploading}
					bind:value={newStory.title}
				/></label
			>
		</form>
	{/if}

	{#if noStoryTitle}
		<p class="mt-3 text-amber-100">Your story needs a name!</p>
	{/if}

	{#if storySelected}
		<p class="mt-3 text-amber-100">You need to choose a story!</p>
	{/if}

	{#if isNewStory || isAddToStory}
		<button
			disabled={!$uploadIsDisabled || !onlineStatus}
			on:click={isNewStory ? uploadFile : patchStory}
			class={isUploading || !$uploadIsDisabled || !onlineStatus
				? 'bg-slate-400 px-3 py-1 rounded mx-1.5 my-4'
				: 'bg-[#b9f6ca] px-3 py-1 rounded mx-1.5 my-4'}>Upload story</button
		>
	{:else if fileUploaded}
		<button on:click={handleReset} class="mx-1.5 my-4 rounded bg-[#b9f6ca] px-3 py-1"
			>Upload another story?</button
		>
	{/if}

	{#if !onlineStatus}
		<p class="text-amber-100">You are presently not online.</p>
	{:else if errorMessage}
		<section class="flex-col">
			<p class="text-amber-100">{errorMessage}</p>
			<p class="text-amber-100">Please try to reupload.</p>
		</section>
	{:else if fileUploaded}
		<p class="text-amber-100">Story uploaded!</p>
	{:else if isUploading}
		<p class="text-amber-100">Story uploading... {Math.round(progress)}% done</p>
	{/if}
</section>

<style></style>
