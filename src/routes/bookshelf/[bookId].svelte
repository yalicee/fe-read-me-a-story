<script lang="ts">
	import Header from '../../components/Header.svelte';
	import Book from '../../components/Book.svelte';
	import { page } from '$app/stores';
</script>

<Header />
<Book bookId={$page.params.bookId} />

<style></style>
