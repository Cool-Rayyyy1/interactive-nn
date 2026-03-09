<script lang="ts">
  import CustomBreadcrumbs from '$lib/components/layout/custom-breadcrumbs.svelte';
  import AppSidebar from '$lib/components/side-bar/app-sidebar.svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  import '../app.css';

  // Svelte 5 runes layout：从 $props() 里取 children
  let { children } = $props();
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
    integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
    crossorigin="anonymous"
  />
</svelte:head>

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
