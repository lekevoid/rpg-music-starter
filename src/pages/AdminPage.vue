<template>
	<q-page class="q-pa-lg">
		<div class="row">
			<h1 class="text-h4">Admin Dashboard</h1>
			<pre>
			<p v-for="(track,k) in filesystemTracks" :key="k">{{ track.file }}</p>
			</pre>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useTracks from "src/composables/UseTracks";
const _filesystemTracks = import.meta.glob("/public/music/*", { eager: true }) || [];
const { tracks /* , fetchTracks */ } = useTracks();

/* function registerTrack(filename) {
	console.log(filename);
}

function registerTracks(trackList) {
	console.log(trackList);
} */

const filesystemTracks = computed(() => {
	return Object.values(_filesystemTracks)
		.map((track) => {
			const filename = track.name.match(/[^/]+\.mp3$/)?.[0];
			if (filename) {
				return { file: filename };
			}
			return null;
		})
		.filter(Boolean);
});

console.log(tracks.value);
</script>
