<template>
	<q-page class="q-pa-lg">
		<div class="row">
			<h1 class="text-h4">Admin Dashboard</h1>
			<q-table flat bordered title="Tracks" :rows="tableData" :columns="tableColumns" row-key="file" binary-state-sort>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="selected" :props="props" class="items-center">
							<input type="checkbox" v-model="props.row.selected" />
						</q-td>
						<q-td key="file" :props="props" class="items-center">
							<p class="q-ma-none">
								{{ props.row.file }}
							</p>
						</q-td>
						<q-td key="file" :props="props" class="items-center">
							<p class="q-ma-none">
								{{ props.row.inDB ? "✅" : "❌" }}
							</p>
						</q-td>
					</q-tr>
				</template>
			</q-table>
			<pre>
				<p v-for="(track,k) in tableData" :key="k">{{ track.selected }}, {{ track.file }}, {{ track.isInDB }}</p>
			</pre>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTracksStore } from "src/stores/store-tracks";
const _filesystemTracks = import.meta.glob("/public/music/*", { eager: true }) || [];
const { tracks /* , fetchTracks */ } = useTracksStore();

/* function registerTrack(filename) {
	console.log(filename);
}

function registerTracks(trackList) {
	console.log(trackList);
} */

const filesystemTracks = computed(() => {
	console.log(tracks);

	return Object.values(_filesystemTracks)
		.map((track) => {
			const filename = track.name.match(/[^/]+\.mp3$/)?.[0];
			const trackExistsInDB = tracks.some((t) => t?.filename === filename);

			if (filename) {
				return { file: filename, inDB: trackExistsInDB };
			}

			return null;
		})
		.filter(Boolean);
});

const tableColumns = [
	{ name: "selected", required: false, label: "", align: "center", field: (row) => row.selected, format: (val) => `${val}`, sortable: true },
	{ name: "file", required: true, label: "File name", align: "left", field: (row) => row.file, format: (val) => `${val}`, sortable: true },
	{ name: "isInDB", required: false, label: "In DB", align: "left", field: (row) => row.inDB, format: (val) => `${val}`, sortable: true },
];

const tableData = ref(filesystemTracks.value.map((track) => ({ ...track, selected: false, isInDB: false })));
</script>
