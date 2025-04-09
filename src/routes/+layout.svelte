<script lang="ts">
	import CustomBreadcrumbs from '$lib/components/layout/custom-breadcrumbs.svelte';
	import AppSidebar from '$lib/components/side-bar/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import '../app.css';
	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<CustomBreadcrumbs />
		</header>
		<div class="m-2">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
