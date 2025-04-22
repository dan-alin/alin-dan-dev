<script lang="ts">
import "../app.css";
let { children } = $props();
</script>


<div class="flex flex-col min-h-dvh  overscroll-none p-10 ">
		{@render children()}
</div>
