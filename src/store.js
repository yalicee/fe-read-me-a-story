import { writable } from 'svelte/store';

export const recordingIsDisabled = writable(false);
export const stopIsDisabled = writable(false);
export const filePresentToUpload = writable(false);