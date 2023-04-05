<template>
	<q-page class="q-pa-lg">
		<div class="row">
			<h1 class="text-h4">Admin Dashboard</h1>
			<q-table
				flat
				bordered
				hide-bottom
				hide-pagination
				title="Tracks"
				:rows="tableData"
				:columns="tableColumns"
				row-key="file"
				binary-state-sort
				:pagination="tablePagination"
				v-model:selected="selectedTracks"
			>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="selected" :props="props" class="items-center">
							<q-checkbox v-model="props.row.selected" />
						</q-td>
						<q-td key="file" :props="props" class="items-center">
							{{ props.row.filename }}
						</q-td>
						<q-td key="file" :props="props" class="items-center">
							<span v-if="props.row.inDB">✅</span>
							<q-btn v-else color="purple" glossy label="Register" size="xs" @click="registerTrack({ filename: props.row.file })" />
						</q-td>
					</q-tr>
				</template>
			</q-table>
			<!-- <pre>
				{{ categories }}
			</pre
			> -->
			<pre>
				<p v-for="(track,k) in tracks" :key="k">{{ track.file }}, {{ track.inDB }}</p>
			</pre>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "src/stores/store-categories";
import { useTracksStore } from "src/stores/store-tracks";

const { categories } = storeToRefs(useCategoriesStore());
const { tracks } = storeToRefs(useTracksStore());
const { addTrackToDB } = useTracksStore();

const _filesystemTracks = import.meta.glob("/public/music/*", { eager: true }) || [];

const selectedTracks = ref([]);

function registerTrack(track /* , fetchAfterRegistering = true */) {
	// console.log(filename, fetchAfterRegistering);
	addTrackToDB(track);
}

/* function registerTracks(trackList) {
	console.log(trackList);
} */

const filesystemTracks = computed(() => {
	let out = Object.values(_filesystemTracks)
		.map((track) => {
			const filename = track.name.match(/[^/]+\.mp3$/)?.[0];

			if (filename) {
				return { filename: filename.replace(".mp3", "") };
			}

			return null;
		})
		.filter(Boolean);

	return out;
});

const allTracks = computed(() => {
	let out = tracks.value.map((t) => ({ ...t, inDB: true, selected: false }));

	filesystemTracks.value.forEach((t) => {
		const existingTrack = out.find((x) => x.filename === t.filename);
		if (!existingTrack) {
			out.push({ ...t, inDB: false, selected: false });
		}
	});

	return out;
});

const tablePagination = {
	sortBy: "filename",
	descending: true,
	page: 1,
	rowsPerPage: 0,
};

const tableColumns = [
	{ name: "selected", required: false, label: "", align: "center", field: (row) => row.selected, format: (val) => `${val}`, sortable: true },
	{ name: "file", required: true, label: "File name", align: "left", field: (row) => row.file, format: (val) => `${val}`, sortable: true },
	{ name: "isInDB", required: false, label: "In DB", align: "left", field: (row) => row.inDB, format: (val) => `${val}`, sortable: true },
];

const tableData = ref(allTracks.value);

watch(allTracks, (newVal) => {
	tableData.value = newVal;
});
</script>
